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
    clientId: "order-consumer",
    brokers: ["localhost:29092"],
});
const consumer = kafka.consumer({ groupId: "order-notifications-group" });
const consumeReservationNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    yield consumer.connect();
    yield consumer.subscribe({
        topic: "order_notifications",
        fromBeginning: true,
    });
    console.log("Consumer connected and listening to order_notifications");
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b;
            try {
                const notificationData = JSON.parse(((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()) || "{}");
                console.log(`Received message from ${topic}:`, notificationData);
                const { userId, fcmToken, orderId, restaurantId, restaurantName, totalCost } = notificationData;
                console.log(notificationData);
                const deviceToken = fcmToken;
                // Send a Firebase Notification
                yield sendFirebaseNotification(deviceToken, "Order Received", `Your order (ID: ${orderId}) has been received at ${restaurantName}. Total: $${totalCost}.`, {
                    orderId,
                    userId,
                    restaurantId,
                    totalCost
                });
            }
            catch (error) {
                console.error("Error processing message:", error);
            }
        }),
    });
});
module.exports = consumeReservationNotifications;
