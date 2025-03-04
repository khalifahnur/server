import GenerateSecretKey from "../../../lib/GenerateSecretKey";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const sendSigninEmail = require("../../../services/email");
const AdminAuth = require("../../../models/admin");

const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();

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

    const token = jwt.sign({ userId: admin._id }, secretKey, {
      expiresIn: "24h",
    });

    // Set the token in a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none" ,
      domain: ".up.railway.app",
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