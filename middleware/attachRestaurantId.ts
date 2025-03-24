import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Redis from "ioredis";

const Admin = require("../models/admin");
import GenerateSecretKey from "../lib/GenerateSecretKey";

//const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();

// Initialize Redis client
const redis = new Redis();
const SECRET_KEY_REDIS_KEY = "jwt_secret_key";

// Function to get the secret key from Redis (or generate if missing)
const getSecretKey = async () => {
  let secretKey = await redis.get(SECRET_KEY_REDIS_KEY);

  if (!secretKey) {
    secretKey = GenerateSecretKey();
    await redis.set(SECRET_KEY_REDIS_KEY, secretKey);
  }

  return secretKey;
};
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
    const secretKey = await getSecretKey();
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
