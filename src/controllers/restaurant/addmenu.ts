import { Request, Response } from "express";
import { uploadMenuToCloudinary } from "../../lib/UploadImage";

const Restaurant = require("../../models/restaurant");

interface NewMenuItem {
  name: string;
  description: string;
  cost: number;
  rate: number;
  image: string;
}

interface AuthenticatedRequest extends Request {
  restaurantId?: {
    id: string;
  };
}

const addMenu = async (req: AuthenticatedRequest, res: Response) => {
  const { menuType } = req.params;
  const newMenuItem: NewMenuItem = req.body;
  const restaurantId = req.restaurantId;

  if (!newMenuItem || !newMenuItem.name || !newMenuItem.cost) {
    return res.status(400).json({ message: "Invalid menu item data" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }
  
  const uploadedImageUrl = await uploadMenuToCloudinary(req.file);

  newMenuItem.image = uploadedImageUrl;


  try {
    let updatePath;
    if (menuType === "breakfast") {
      updatePath = "data.0.menu.breakfast";
    } else if (menuType === "lunch") {
      updatePath = "data.0.menu.lunch";
    } else if (menuType === "dinner") {
      updatePath = "data.0.menu.dinner";
    } else {
      return res.status(400).json({ message: "Invalid menu type" });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { [updatePath]: newMenuItem } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(201).json({ message: "Menu item added successfully" });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Error adding menu item", error });
  }
};

module.exports = addMenu;
