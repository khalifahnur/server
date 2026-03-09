import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getSecretKey from "../lib/getSecretKey";

interface AdminRequest extends Request {
  adminId?: {
    id: string;
  };
}

const authenticateAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.admin_auth;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded?.adminId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const secretKey = await getSecretKey(decoded?.adminId);
    const verified = jwt.verify(token, secretKey) as jwt.JwtPayload;
    req.adminId = { id: verified.adminId };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateAdmin;
