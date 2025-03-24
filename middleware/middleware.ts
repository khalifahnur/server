// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// import GenerateSecretKey from "../lib/GenerateSecretKey";

// const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();

// const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Access token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
//     req.user = { id: decoded.userId };
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = authenticateUser;

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import GenerateSecretKey from "../lib/GenerateSecretKey";

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

// Authentication middleware
const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const secretKey = await getSecretKey(); // Fetch secret key from Redis
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;

