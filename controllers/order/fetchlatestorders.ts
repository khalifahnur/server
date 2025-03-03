import { Request, Response } from "express";
const Order = require("../../models/order");

const fetchLatestOrder = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ error: "RestaurantId is required" });
  }

  try {
    const orders = await Order.find({ restaurantId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Successfully fetched orders",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching orders" });
  }
};

module.exports = fetchLatestOrder;
