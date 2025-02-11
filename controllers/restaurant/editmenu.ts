import { Request, Response } from "express";
import mongoose from "mongoose";

const Restaurant = require("../../models/restaurant");

interface AuthenticatedRequest extends Request {
  restaurantId?: {
    id: string;
  };
}

const updateMenuItem = async (req: AuthenticatedRequest, res: Response) => {
  const { menuType, itemId } = req.params;
  const { menu, description, price } = req.body;

  const name = menu;
  const cost = price;
  const restaurantId = req.restaurantId;

  if (cost !== undefined && typeof cost !== "number") {
    return res.status(400).json({ message: "Invalid cost" });
  }

  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "Invalid description" });
  }

  try {
    const validMenuTypes = ["breakfast", "lunch", "dinner"];
    if (!validMenuTypes.includes(menuType)) {
      return res.status(400).json({ message: "Invalid menu type" });
    }

    const updatePath = `data.0.menu.${menuType}`;
    const updateFields: any = {};

    if (name)
      updateFields["$set"] = {
        ...updateFields["$set"],
        [`${updatePath}.$.name`]: name,
      };
    if (description)
      updateFields["$set"] = {
        ...updateFields["$set"],
        [`${updatePath}.$.description`]: description,
      };
    if (cost)
      updateFields["$set"] = {
        ...updateFields["$set"],
        [`${updatePath}.$.cost`]: cost,
      };

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      {
        _id: restaurantId,
        [`${updatePath}._id`]: new mongoose.Types.ObjectId(itemId),
      },
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json({
      message: "Menu item updated successfully",
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = updateMenuItem;
