"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Admin = require("../../../models/admin");
const Restaurant = require("../../../models/restaurant");
const getAdminInfo = async (req, res) => {
    const userId = req.user?.id;
    console.log(userId);
    try {
        if (!userId) {
            return res.status(400).json({ error: "User not authenticated" });
        }
        const adminInfo = await Admin.findById(userId);
        if (!adminInfo) {
            return res.status(404).json({ error: "Admin info not found" });
        }
        let restaurantData = {};
        let aboutInfo = {};
        if (adminInfo.restaurantId) {
            const restaurantInfo = await Restaurant.findById(adminInfo.restaurantId);
            if (restaurantInfo) {
                // If your Restaurant model has `data[0]`
                restaurantData = Array.isArray(restaurantInfo.data)
                    ? restaurantInfo.data[0] || {}
                    : restaurantInfo;
                aboutInfo = Array.isArray(restaurantData.about)
                    ? restaurantData.about[0] || {}
                    : {};
            }
        }
        const responseData = {
            name: adminInfo.name,
            firstName: adminInfo.firstName,
            lastName: adminInfo.lastName,
            createdAt: adminInfo.createdAt,
            email: adminInfo.email || null,
            phoneNumber: adminInfo.phoneNumber || null,
            avatar: adminInfo.avatar || null,
            restaurantName: restaurantData.restaurantName || null,
            restaurantId: restaurantData._id || null,
            location: restaurantData.location || null,
            image: restaurantData.image || null,
            hrsOfOperation: aboutInfo.hrsOfOperation || null,
            description: aboutInfo.description || null,
            phone: aboutInfo.phone || null,
            restaurantEmail: aboutInfo.email || null,
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error fetching admin info:", error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = getAdminInfo;
//# sourceMappingURL=fetchinfo.js.map