import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import getSecretKey from "../../../lib/getSecretKey";
import newSecretKey from "../../../lib/rotateSecretKey";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const LogoutAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    const secretKey = await getSecretKey(decoded.userId);

    jwt.verify(token, secretKey);

    await newSecretKey(decoded.userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = LogoutAdmin;
