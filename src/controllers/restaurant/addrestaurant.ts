import { Request, Response } from "express";
const Restaurant = require("../../models/restaurant");
const Admin = require("../../models/admin");

import { uploadImageToCloudinary } from "../../lib/UploadImage";

interface AuthenticatedRequest extends Request {
  adminId?: {
    id: string;
  };
}

const addRestaurantData = async (req: AuthenticatedRequest, res: Response) => {
  const admin = req.adminId?.id;

  try {
    if (!admin) {
      return res.status(400).json({ error: "Admin not authenticated" });
    }

    if (!req.body.data) {
      return res.status(400).json({ message: "Data is invalid or empty" });
    }

    const parsedData = JSON.parse(req.body.data);

    const { title, data } = parsedData;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Data is invalid or empty" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const uploadedImageUrl = await uploadImageToCloudinary(req.file);
    data[0].image = uploadedImageUrl;

    const newRestaurant = new Restaurant({ title, data });
    const savedRestaurant = await newRestaurant.save();

    if (admin) {
      await Admin.findByIdAndUpdate(admin, {
        restaurantId: savedRestaurant._id,
      });
    }

    res.status(201).json({
      message: "Restaurant data added successfully",
      restaurant: savedRestaurant,
    });
  } catch (error) {
    console.log("Error adding restaurant info",error)
    res.status(500).json({ message: "Error adding restaurant data", error });
  }
};

module.exports = addRestaurantData;
