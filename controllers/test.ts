import { Request, Response } from "express";
import { Kafka, logLevel, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-express-app",
  brokers: ["localhost:29092"],
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  logLevel: logLevel.INFO
});

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000
  })
  

async function connectWithRetry() {
    try {
      await producer.connect()
      console.log('Producer connected successfully')
    } catch (error) {
      console.error('Failed to connect producer, retrying in 5 seconds...', error)
      setTimeout(connectWithRetry, 5000)
    }
  }
  
connectWithRetry()

const kafkatesting = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    await producer.send({
      topic: "test-topic",
      messages: [{ value: message }],
    });

    res.json({ status: "Message sent successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = kafkatesting;
