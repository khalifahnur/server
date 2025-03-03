import { Request, Response } from "express";

const Order = require("../../models/order");

const fetchAllUserOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const orders = await Order.find({
      userId: userId,
    }).lean();

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json({message:"successfully fetched user orders",orders});
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while orders the reservation" });
  }
};

module.exports = fetchAllUserOrder;
