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
// producer.ts
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "order-service",
    brokers: ["localhost:29092"],
});
const producer = kafka.producer();
// Connect once at startup
producer.connect()
    .then(() => console.log("Kafka Producer Connected"))
    .catch(console.error);
const sendReservationNotification = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield producer.send({
            topic: "order_notifications",
            messages: [{ key: message.userId, value: JSON.stringify(message) }],
        });
        console.log("Message sent to Kafka");
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
});
module.exports = sendReservationNotification;
