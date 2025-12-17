import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getSecretKey from "../lib/getSecretKey";
const Admin = require("../models/admin");

interface AuthenticatedRequest extends Request {
  restaurantId?: string; 
}

const attachRestaurantId = async (
  req: AuthenticatedRequest,
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

exports.module =  attachRestaurantId; 