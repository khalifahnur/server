import { Kafka } from "kafkajs";

const sendFirebaseNotification = require('../../firebase/fcmService')

const kafka = new Kafka({
  clientId: "reservation-consumer",
  brokers: ["localhost:29092"], 
});

const consumer = kafka.consumer({ groupId: "reservation-notifications-group" });

const consumeReservationNotifications = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "reservation_notifications",
    fromBeginning: true,
  });

  console.log("Consumer connected and listening to reservation_notifications");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const notificationData = JSON.parse(message.value?.toString() || "{}");
        console.log(`Received message from ${topic}:`, notificationData);

        const { userId, deviceToken, reservationId, date, time } =
          notificationData;

          console.log(notificationData);

        // Send a Firebase Notification
        await sendFirebaseNotification(
          deviceToken,
          "Reservation Completed",
          `Your reservation (ID: ${reservationId}) is confirmed for ${date} at ${time}.`,
          { reservationId, userId, date, time }
        );
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

module.exports = consumeReservationNotifications;
