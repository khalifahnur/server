import { Request, Response } from "express";

const UserView = require("../../models/userviews");

const postRecentlyView = async (req: Request, res: Response) => {
  const { restaurantId, userId } = req.body;

  try {
    if (!restaurantId && !userId) {
      res.status(404).json({ message: "restaurantId and userId are required" });
    }
    const view = new UserView({ userId, restaurantId });

    await view.save();

    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
  }
};

module.exports = postRecentlyView;
