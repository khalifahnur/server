import { Request, Response } from "express";
import { Document, Types } from "mongoose";

const UserView = require("../../models/userviews");
const Restaurant = require("../../models/restaurant");

interface About {
  description: string;
  averagePrice: number;
  hrsOfOperation: string;
  phone: string;
  email: string;
}

interface MenuItem {
  image: string;
  name: string;
  description: string;
  cost: number;
  rate: number;
}

interface Review {
  name: string;
  image: string;
  reviewTxt: string;
  rating: number;
}

interface Menu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

interface RestaurantData {
  image: string;
  restaurantName: string;
  location: string;
  latitude: number;
  longitude: number;
  rate: number;
  about: About[];
  menu: Menu;
  review: Review[];
}

interface RestaurantDocument extends Document {
  title: string;
  data: RestaurantData[];
}

interface RecentlyViewedItem extends Document {
  _id: Types.ObjectId;
  restaurantId: RestaurantDocument;
  userId: Types.ObjectId;
  viewedAt: Date;
}

const fetchRecentlyView = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const recentlyViewed: RecentlyViewedItem[] = await UserView.find({ userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate("restaurantId");

    const restaurantIds = recentlyViewed.map((item) => item.restaurantId);

    const restaurants: RestaurantDocument[] = await Restaurant.find({
      _id: { $in: restaurantIds },
    });
    res.status(200).json(restaurants);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = fetchRecentlyView;