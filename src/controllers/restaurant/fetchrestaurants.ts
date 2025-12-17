import { Request, Response } from "express";

const Restaurant = require("../../models/restaurant");

const fetchallrestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res
      .status(200)
      .json({ message: "restaurants fetched successfully", restaurants });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch restaurants." });
  }
};

module.exports = fetchallrestaurants;