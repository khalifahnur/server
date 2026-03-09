"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Admin = require("../../../models/admin");
const Waiter = require("../../../models/waiter");
const fetchWaiter = async (req, res) => {
    const admin = req.adminId?.id;
    try {
        if (!admin) {
            return res.status(400).json({ error: "User not authenticated" });
        }
        const adminInfo = await Admin.findById(admin);
        if (!adminInfo) {
            return res.status(404).json({ error: "Admin info not found" });
        }
        const waiter = await Waiter.find({ restaurantId: adminInfo.restaurantId }).lean();
        res.status(200).json({ message: "fetched waiter", waiter });
    }
    catch (error) {
        console.error("Error fetching waiter:", error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = fetchWaiter;
//# sourceMappingURL=fetchWaiter.js.map