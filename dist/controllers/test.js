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
    clientId: "my-express-app",
    brokers: ["localhost:29092"],
    retry: {
        initialRetryTime: 100,
        retries: 8
    },
    logLevel: kafkajs_1.logLevel.INFO
});
const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000
});
function connectWithRetry() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield producer.connect();
            console.log('Producer connected successfully');
        }
        catch (error) {
            console.error('Failed to connect producer, retrying in 5 seconds...', error);
            setTimeout(connectWithRetry, 5000);
        }
    });
}
connectWithRetry();
const kafkatesting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        yield producer.send({
            topic: "test-topic",
            messages: [{ value: message }],
        });
        res.json({ status: "Message sent successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = kafkatesting;
