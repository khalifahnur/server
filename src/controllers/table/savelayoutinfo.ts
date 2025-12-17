import { Request, Response } from "express";
const RestaurantLayout = require("../../models/restaurantlayout");

interface AuthenticatedRequest extends Request {
  restaurantId?: {
    id: string;
  };
}

const SaveLayoutInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const { diningAreas, tableCapacity, totalTables } = req.body;

    if (!diningAreas) {
      return res.status(400).json({ message: "Dining areas are required" });
    }

    const layoutInfo = await RestaurantLayout.findByIdAndUpdate(
      restaurantId,
      { restaurantId,diningAreas, tableCapacity, totalTables },
      { new: true, upsert: true }
    );

    if (!layoutInfo) {
      return res.status(404).json({ message: "Layout information not found" });
    }

    res.status(200).json({
      message: "Layout updated successfully",
      layout: {
        diningAreas: layoutInfo.diningAreas,
        totalCapacity: layoutInfo.totalCapacity,
        totalTables: layoutInfo.totalTables,
      },
    });
  } catch (error) {
    console.error("Error saving layout info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = SaveLayoutInfo;
