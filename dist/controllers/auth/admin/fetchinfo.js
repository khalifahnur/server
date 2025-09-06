"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Admin = require("../../../models/admin");
const Restaurant = require("../../../models/restaurant");
const getAdminInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log(userId);
    try {
        if (!userId) {
            return res.status(400).json({ error: "User not authenticated" });
        }
        const adminInfo = yield Admin.findById(userId);
        if (!adminInfo) {
            return res.status(404).json({ error: "Admin info not found" });
        }
        let restaurantData = {};
        let aboutInfo = {};
        if (adminInfo.restaurantId) {
            const restaurantInfo = yield Restaurant.findById(adminInfo.restaurantId);
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
});
module.exports = getAdminInfo;
