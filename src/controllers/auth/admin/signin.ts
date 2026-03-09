import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import getSecretKey from "../../../lib/getSecretKey";
import { verifyPassword } from "../../../lib/hashPassword";
//const sendSigninEmail = require("../../../services/email");
const AdminAuth = require("../../../models/admin");


const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminAuth.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }
    const isPasswordMatch = verifyPassword(admin.password, password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const secretKey = await getSecretKey(admin._id.toString());
    const token = jwt.sign({ adminId: admin._id }, secretKey, {
      expiresIn: "24h",
    });

    res.cookie('admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      //sameSite: 'none',
      //domain: 'server-production-2ee7.up.railway.app',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    

    //await sendSigninEmail(email);

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