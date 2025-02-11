// producer.ts
import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer();

// Connect once at startup
producer.connect()
  .then(() => console.log("Kafka Producer Connected"))
  .catch(console.error);

const sendReservationNotification = async (message: any) => {
  try {
    await producer.send({
      topic: "order_notifications",
      messages: [{ key: message.userId, value: JSON.stringify(message) }],
    });
    console.log("Message sent to Kafka");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = sendReservationNotification