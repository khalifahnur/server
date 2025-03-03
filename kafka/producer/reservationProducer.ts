import { Kafka, logLevel, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "reservation-service",
  brokers: ["localhost:29092"],
  connectionTimeout: 3000,
  retry: {
    initialRetryTime: 1000,
    retries: 15,
    maxRetryTime: 30000,
    factor: 1.5,
  },
  logLevel: logLevel.INFO
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
});

const admin = kafka.admin();

// Ensure topic exists before producing messages
async function ensureTopicExists(topicName: string) {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    
    if (!topics.includes(topicName)) {
      console.log(`Creating topic: ${topicName}`);
      await admin.createTopics({
        topics: [
          { 
            topic: topicName,
            numPartitions: 1,
            replicationFactor: 1
          },
        ],
        waitForLeaders: true, // This is important
      });
      console.log(`Topic ${topicName} created successfully`);
      // Wait for leadership election to stabilize
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log(`Topic ${topicName} already exists`);
    }
  } catch (error) {
    console.error(`Error ensuring topic exists: ${error}`);
    throw error;
  }
}

// Connect with proper initialization
async function initialize() {
  try {
    await admin.connect();
    console.log("Admin connected");
    
    await ensureTopicExists("reservation_notifications");
    
    await producer.connect();
    console.log("Kafka Producer Connected");
    
    return true;
  } catch (error) {
    console.error("Error during initialization:", error);
    return false;
  }
}

// Initialize with retry logic
(async () => {
  let connected = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`Attempt ${attempt} to initialize Kafka...`);
    connected = await initialize();
    if (connected) break;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  if (!connected) {
    console.error("Failed to initialize Kafka after multiple attempts");
    process.exit(1);
  }
})();

// Function to send reservation notification
const sendReservationNotification = async (message: any) => {
  try {
    // Simply try to send the message, KafkaJS will manage reconnections
    await producer.send({
      topic: "reservation_notifications",
      messages: [{ key: message.userId, value: JSON.stringify(message) }],
    });
    console.log("Message sent to Kafka");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = sendReservationNotification;
