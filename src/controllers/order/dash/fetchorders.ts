import { Request, Response } from "express";
const Order = require("../../../models/order");

interface AuthenticatedRequest extends Request {
  restaurantId?: {
    id: string;
  }
}

const fetchAllOrder = async (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "Restaurant ID is required" });
  }

  try {
    const orders = await Order.find({ restaurantId: restaurantId })
      .sort({ createdAt: -1 })
      .limit(500) 
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json({ message: "Successfully fetched orders", orders });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving orders" });
  }
};

module.exports = fetchAllOrder