import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
    clientId: "my-express-app",
    brokers: ["localhost:29092"],
  });

const consumer = kafka.consumer({ groupId: 'express-app-group' })
async function setupConsumer() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        value: message?.value?.toString(),
      })
    },
  })
}
setupConsumer().catch(console.error)