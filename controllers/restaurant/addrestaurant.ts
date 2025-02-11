import { Request, Response } from "express";
const Restaurant = require("../../models/restaurant");
const AdminAuth = require("../../models/admin");

import { uploadImageToCloudinary } from "../../lib/UploadImage";

// Define an interface for the expected request body
interface InitialRestaurantData {
  title: string;
  data: {
    image: string;
    restaurantName: string;
    location: string;
    latitude: number;
    longitude: number;
    rate: number;
    about: {
      description: string;
      averagePrice: number;
      hrsOfOperation: string;
      phone: string;
      email: string;
    };
  }[];
}

// Define an extended request type with `user`
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const addRestaurantData = async (req: AuthenticatedRequest, res: Response) => {
  try {

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

    const userId = req.user?.id;

    if (userId) {
      await AdminAuth.findByIdAndUpdate(userId, {
        restaurantId: savedRestaurant._id,
      });
    }

    res.status(201).json({
      message: "Restaurant data added successfully",
      restaurant: savedRestaurant,
    });
  } catch (error) {
    console.error("Error adding restaurant data:", error);
    res.status(500).json({ message: "Error adding restaurant data", error });
  }
};


module.exports = addRestaurantData;
