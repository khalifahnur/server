import GenerateSecretKey from "../../../lib/GenerateSecretKey";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Redis from "ioredis";

const sendSigninEmail = require("../../../services/email");
const AdminAuth = require("../../../models/admin");

//const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();

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

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminAuth.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const secretKey = await getSecretKey();
    const token = jwt.sign({ userId: admin._id }, secretKey, {
      expiresIn: "24h",
    });

    console.log("token form singin",token)

    // Set the token in a cookie
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   domain: process.env.NODE_ENV === "production" ? ".up.railway.app" : "localhost",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'lax' for local
      //sameSite: 'none',
      //domain: 'server-production-2ee7.up.railway.app',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send email
    await sendSigninEmail(email);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        restaurantId: admin.restaurantId || null,
      },
    });
  } catch (error) {
    console.error("Error occurred during login:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unexpected error occurred during login";

    res.status(500).json({
      message: errorMessage,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

module.exports = loginAdmin;