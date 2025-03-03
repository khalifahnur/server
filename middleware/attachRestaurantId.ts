import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const Admin = require("../models/admin");
import GenerateSecretKey from "../lib/GenerateSecretKey";

const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();

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
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const userId = decoded.userId;

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
