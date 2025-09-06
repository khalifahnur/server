import { Request, Response } from "express";

const Admin = require("../../../models/admin");
const Waiter = require("../../../models/waiter");

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const fetchWaiter = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const adminInfo = await Admin.findById(userId);
    if (!adminInfo) {
      return res.status(404).json({ error: "Admin info not found" });
    }

    const waiter = Waiter.find(adminInfo.restaurantId).lean();

    res.status(200).json({ message: "fetched waiter", waiter });
  } catch (error) {
    console.error("Error fetching waiter:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = fetchWaiter;
