import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import GenerateSecretKey from "../../../lib/GenerateSecretKey";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();
const LogoutAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite:"none",
      domain: ".up.railway.app",
      path:'/'
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = LogoutAdmin;
