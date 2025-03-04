"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "reservation-service",
    brokers: ["localhost:29092"],
    connectionTimeout: 3000,
    retry: {
        initialRetryTime: 1000,
        retries: 15,
        maxRetryTime: 30000,
        factor: 1.5,
    },
    logLevel: kafkajs_1.logLevel.INFO
});
const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000
});
const admin = kafka.admin();
// Ensure topic exists before producing messages
function ensureTopicExists(topicName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield admin.connect();
            const topics = yield admin.listTopics();
            if (!topics.includes(topicName)) {
                console.log(`Creating topic: ${topicName}`);
                yield admin.createTopics({
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
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
            else {
                console.log(`Topic ${topicName} already exists`);
            }
        }
        catch (error) {
            console.error(`Error ensuring topic exists: ${error}`);
            throw error;
        }
    });
}
// Connect with proper initialization
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield admin.connect();
            console.log("Admin connected");
            yield ensureTopicExists("reservation_notifications");
            yield producer.connect();
            console.log("Kafka Producer Connected");
            return true;
        }
        catch (error) {
            console.error("Error during initialization:", error);
            return false;
        }
    });
}
// Initialize with retry logic
(() => __awaiter(void 0, void 0, void 0, function* () {
    let connected = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`Attempt ${attempt} to initialize Kafka...`);
        connected = yield initialize();
        if (connected)
            break;
        yield new Promise(resolve => setTimeout(resolve, 5000));
    }
    if (!connected) {
        console.error("Failed to initialize Kafka after multiple attempts");
        process.exit(1);
    }
}))();
// Function to send reservation notification
const sendReservationNotification = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simply try to send the message, KafkaJS will manage reconnections
        yield producer.send({
            topic: "reservation_notifications",
            messages: [{ key: message.userId, value: JSON.stringify(message) }],
        });
        console.log("Message sent to Kafka");
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
});
module.exports = sendReservationNotification;
