import { Request, Response } from "express";

const Order = require("../../models/order");

const fetchServedOrder = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ error: "RestaurantId is required" });
  }

  try {
    const orders = await Order.find({
      restaurantId: restaurantId,
      status:'Served'
    }).lean();

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json({message:"successfully fetched served orders",orders});
  } catch (error) {
    console.error("Error retrieving served orders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching served orders" });
  }
};

module.exports = fetchServedOrder;
