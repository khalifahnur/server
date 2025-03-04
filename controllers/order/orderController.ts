import { Request, Response } from "express";
const Order = require("../../models/order");

//const sendOrderNotification = require("../../kafka/producer/orderProducer");

import { GenerateOrderId } from "../../lib/GenerateOrderId";

const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      menu,
      userId,
      restaurantId,
      reservationId,
      //diningArea,
      tableNumber,
    } = req.body;

    // const fcmToken = req.params;

    // Validate required fields
    if (
      !menu ||
      !userId ||
      !restaurantId ||
      !reservationId ||
      //!diningArea ||
      !tableNumber
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = GenerateOrderId(restaurantId);

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

    const savedOrder = await newOrder.save();

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
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = createOrder;
