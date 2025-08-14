import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getSecretKey from "../lib/getSecretKey";

// Authentication middleware
const authenticateUser = async (
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
    req.user = { id: verified.userId };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;


