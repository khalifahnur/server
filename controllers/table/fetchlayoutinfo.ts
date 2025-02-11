import { Request, Response } from "express";
const RestaurantLayout = require("../../models/restaurantlayout");

interface AuthenticatedRequest extends Request {
  restaurantId?: {
    id: string;
  };
}

const FetchRestaurantInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const restaurantLayoutInfo = await RestaurantLayout.findById(restaurantId);
    if (!restaurantLayoutInfo) {
      return res.status(404).json({ message: "Dining areas not found" });
    }

    res.status(200).json({ diningAreas: restaurantLayoutInfo.diningAreas });
  } catch (e) {
    console.error("An error occurred when fetching restaurant layout:", e);
    res.status(500).json({ message: "Error fetching restaurant layout" });
  }
};

module.exports = FetchRestaurantInfo;
