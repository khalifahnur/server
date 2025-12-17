import { Request, Response } from "express";
import { GenerateOrderId } from "../../../lib/GenerateOrderId";

const Order = require("../../../models/order");
const Reservation = require("../../../models/reservation");

interface MenuItem {
  _id: string;
  name: string;
  cost: number;
  quantity: number;
}

interface CreateOrderRequest {
  menu: MenuItem[];
  userId: string;
  restaurantId: string;
  reservationId: string;
  tableNumber: string;
}

const createOrder = async (req: Request, res: Response) => {
  const { menu, userId, restaurantId, reservationId, tableNumber } =
    req.body as CreateOrderRequest;
  try {
    if (!userId || !restaurantId || !reservationId || !tableNumber) {
      return res
        .status(400)
        .json({ message: "Missing required identity fields" });
    }

    if (!menu || !Array.isArray(menu) || menu.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one menu item" });
    }

    const reservationDoc = await Reservation.findOne({
      "reservationInfo.reservationID": reservationId,
    });

    if (!reservationDoc) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Calculate total for the NEW items being added
    const newItemsTotal = menu.reduce((acc, item) => {
      return acc + item.cost * item.quantity;
    }, 0);

    // --- CHECK FOR EXISTING ACTIVE ORDER ---
    // If the reservation already has an order linked, check if it's still active (unpaid/not cancelled)
    let existingOrder = null;

    if (reservationDoc.userOrder) {
      existingOrder = await Order.findOne({
        _id: reservationDoc.userOrder,
        paymentStatus: "unpaid",
        orderStatus: { $ne: "cancelled" },
      });
    }

    if (existingOrder) {
      existingOrder.items.push(...menu);

      existingOrder.totalAmount =
        (existingOrder.totalAmount || 0) + newItemsTotal;

      const updatedOrder = await existingOrder.save();

      return res.status(200).json({
        message: "Order updated successfully",
        order: updatedOrder,
      });
    } else {
      const orderCustomId = GenerateOrderId(restaurantId);

      const newOrder = new Order({
        userId,
        restaurantId,
        reservationId: reservationDoc._id,
        tableNumber,
        items: menu,
        totalAmount: newItemsTotal,
        orderId: orderCustomId,
        orderStatus: "placed",
        paymentStatus: "unpaid",
      });

      const savedOrder = await newOrder.save();
      await Reservation.findByIdAndUpdate(reservationDoc._id, {
        userOrder: savedOrder._id,
        status: "active",
      });

      return res.status(201).json({
        message: "Order created successfully",
        order: savedOrder,
      });
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }

    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = createOrder;
