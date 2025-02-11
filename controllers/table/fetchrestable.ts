import { Request, Response } from "express";
import mongoose from "mongoose";
const RestaurantLayout = require("../../models/restaurantlayout");

export interface RestaurantTable {
  restaurantId: string;
  diningAreas: string;
  totalTables: number;
  totalCapacity: number;
  tablePosition: Table[];
}

export interface Chair {
  id: string;
  position: string;
}

export interface Table {
  id: string;
  name: string;
  status: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  shape: string;
  size: {
    width: number;
    height: number;
  };
  chairs: Chair[];
  floorId: string;
}

const FetchResTable = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId || typeof restaurantId !== 'string') {
      return res.status(400).json({ message: "Invalid or missing restaurantId" });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId format" });
    }

    const restaurantLayoutData = await RestaurantLayout.findById(restaurantId).lean();

    if (!restaurantLayoutData) {
      return res.status(404).json({ error: "Tables not found for this restaurant" });
    }

    res.status(200).json({
      message: 'Fetched tables successfully',
      restaurantLayoutData
    });
  } catch (error) {
    console.error("Error fetching restaurant tables:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = FetchResTable;
