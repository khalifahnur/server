import { Kafka, logLevel } from "kafkajs";

const sendFirebaseNotification = require('../../firebase/fcmService');

const kafka = new Kafka({
  clientId: "reservation-consumer",
  brokers: ["localhost:29092"],
  connectionTimeout:3000,
  logLevel: logLevel.INFO
});

const consumer = kafka.consumer({ 
  groupId: "reservation-notifications-group",
});

const admin = kafka.admin();

// Ensure topic exists before consuming messages
async function ensureTopicExists(topicName: string) {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes(topicName)) {
      console.log(`Creating topic: ${topicName}`);
      await admin.createTopics({
        topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
        waitForLeaders: true,
      });
      console.log(`Topic ${topicName} created successfully`);
    } else {
      console.log(`Topic ${topicName} already exists`);
    }
  } catch (error) {
    console.error(`Error ensuring topic exists: ${error}`);
    throw error;
  } finally {
    await admin.disconnect();
  }
}

const consumeReservationNotifications = async () => {
  try {
    await ensureTopicExists("reservation_notifications");
    
    await consumer.connect();
    console.log("Consumer connected");

    await consumer.subscribe({ topic: "reservation_notifications", fromBeginning: true });
    console.log("Subscribed to reservation_notifications");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const notificationData = JSON.parse(message.value?.toString() || "{}");
          console.log(`Received message from ${topic}:`, notificationData);

          const { userId, deviceToken, reservationId, date, time, restaurantName } = notificationData;
          
          // Send a Firebase Notification
          await sendFirebaseNotification(
            deviceToken,
            "Reservation Completed",
            ` 🟢 🍽 🍴 reservation (ID: ${reservationId}) is confirmed at ${restaurantName} for ${date} | ${time} .`,
            { reservationId, userId, date, time, restaurantName }
          );
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error setting up consumer:", error);
    setTimeout(consumeReservationNotifications, 5000);
  }
};

(async () => {
  await consumeReservationNotifications();
})();
