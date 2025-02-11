import { Kafka } from "kafkajs";

const sendFirebaseNotification = require('../../firebase/fcmService')

const kafka = new Kafka({
  clientId: "order-consumer",
  brokers: ["localhost:29092"], 
});

const consumer = kafka.consumer({ groupId: "order-notifications-group" });

const consumeReservationNotifications = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "order_notifications",
    fromBeginning: true,
  });

  console.log("Consumer connected and listening to order_notifications");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const notificationData = JSON.parse(message.value?.toString() || "{}");
        console.log(`Received message from ${topic}:`, notificationData);

        const { userId, fcmToken, orderId,restaurantId,restaurantName,totalCost } =
          notificationData;

          console.log(notificationData);

          const deviceToken = fcmToken

        // Send a Firebase Notification
        await sendFirebaseNotification(
            deviceToken,
            "Order Received",
            `Your order (ID: ${orderId}) has been received at ${restaurantName}. Total: $${totalCost}.`,
            { 
              orderId,
              userId, 
              restaurantId,
              totalCost
            }
          );
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

module.exports = consumeReservationNotifications;
