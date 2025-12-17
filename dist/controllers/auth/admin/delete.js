"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Admin = require("../../../models/admin");
const Waiter = require("../../../models/waiter");
const deleteWaiter = async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ error: "User not authenticated" });
        }
        const adminInfo = await Admin.findById(userId);
        if (!adminInfo) {
            return res.status(404).json({ error: "Admin info not found" });
        }
        await Waiter.findByIdAndDelete(id);
        res.json({ message: "Waiter deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting waiter:", error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = deleteWaiter;
//# sourceMappingURL=delete.js.map