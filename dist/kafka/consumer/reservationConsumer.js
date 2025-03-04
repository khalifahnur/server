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
const sendFirebaseNotification = require('../../firebase/fcmService');
const kafka = new kafkajs_1.Kafka({
    clientId: "reservation-consumer",
    brokers: ["localhost:29092"],
    connectionTimeout: 3000,
    logLevel: kafkajs_1.logLevel.INFO
});
const consumer = kafka.consumer({
    groupId: "reservation-notifications-group",
});
const admin = kafka.admin();
// Ensure topic exists before consuming messages
function ensureTopicExists(topicName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield admin.connect();
            const topics = yield admin.listTopics();
            if (!topics.includes(topicName)) {
                console.log(`Creating topic: ${topicName}`);
                yield admin.createTopics({
                    topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
                    waitForLeaders: true,
                });
                console.log(`Topic ${topicName} created successfully`);
            }
            else {
                console.log(`Topic ${topicName} already exists`);
            }
        }
        catch (error) {
            console.error(`Error ensuring topic exists: ${error}`);
            throw error;
        }
        finally {
            yield admin.disconnect();
        }
    });
}
const consumeReservationNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ensureTopicExists("reservation_notifications");
        yield consumer.connect();
        console.log("Consumer connected");
        yield consumer.subscribe({ topic: "reservation_notifications", fromBeginning: true });
        console.log("Subscribed to reservation_notifications");
        yield consumer.run({
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
                var _b;
                try {
                    const notificationData = JSON.parse(((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()) || "{}");
                    console.log(`Received message from ${topic}:`, notificationData);
                    const { userId, deviceToken, reservationId, date, time, restaurantName } = notificationData;
                    // Send a Firebase Notification
                    yield sendFirebaseNotification(deviceToken, "Reservation Completed", ` 🟢 🍽 🍴 reservation (ID: ${reservationId}) is confirmed at ${restaurantName} for ${date} | ${time} .`, { reservationId, userId, date, time, restaurantName });
                }
                catch (error) {
                    console.error("Error processing message:", error);
                }
            }),
        });
    }
    catch (error) {
        console.error("Error setting up consumer:", error);
        setTimeout(consumeReservationNotifications, 5000);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield consumeReservationNotifications();
}))();
