import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const Admin = require("../models/admin");
import getSecretKey from "../lib/getSecretKey";

const attachRestaurantId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const secretKey = await getSecretKey(decoded?.userId);
    const verified = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const userId = verified.userId;

    // Find the admin by userId and get the restaurantId
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.restaurantId = admin.restaurantId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = attachRestaurantId;
