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
const Order = require("../../models/order");
const sendOrderNotification = require("../../kafka/producer/orderProducer");
const GenerateOrderId_1 = require("../../lib/GenerateOrderId");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { menu, userId, restaurantId, reservationId, 
        //diningArea,
        tableNumber, } = req.body;
        // const fcmToken = req.params;
        // Validate required fields
        if (!menu ||
            !userId ||
            !restaurantId ||
            !reservationId ||
            //!diningArea ||
            !tableNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const orderId = (0, GenerateOrderId_1.GenerateOrderId)(restaurantId);
        // Create and save order
        const newOrder = new Order({
            menu,
            userId,
            restaurantId,
            reservationId,
            //diningArea,
            tableNumber,
            orderId,
        });
        const savedOrder = yield newOrder.save();
        // Prepare Kafka message
        // const kafkaMessage = {
        //   orderId: savedOrder.orderId(),
        //   userId: savedOrder.userId,
        //   restaurantId: savedOrder.restaurantId,
        //   status: savedOrder.status,
        //   totalCost: savedOrder.menu.reduce((sum, item) => sum + item.cost, 0),
        //   createdAt: savedOrder.createdAt,
        //   fcmToken
        // };
        // await sendOrderNotification(kafkaMessage);
        res.status(201).json({
            message: "Order created successfully",
            // notificationSent: true,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Order creation error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = createOrder;
