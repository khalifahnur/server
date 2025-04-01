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
        // Fetch restaurant info using restaurantId from adminInfo
        const restaurantId = adminInfo.restaurantId; // Assuming restaurantId is stored in adminInfo
        const restaurantInfo = yield Restaurant.findById(restaurantId);
        if (!restaurantInfo) {
            return res.status(404).json({ error: "Restaurant info not found" });
        }
        // Access the first element of the data array
        const restaurantData = restaurantInfo.data[0]; // Get the first restaurant data object
        const aboutInfo = restaurantData.about[0] || {}; // Get the first about entry
        const responseData = {
            name: adminInfo.name,
            email: adminInfo.email,
            phoneNumber: adminInfo.phoneNumber,
            restaurantName: restaurantData.restaurantName,
            location: restaurantData.location,
            image: restaurantData.image,
            hrsOfOperation: aboutInfo.hrsOfOperation || null, // Default to null if not available
            description: aboutInfo.description || null, // Default to null if not available
            phone: aboutInfo.phone || null, // Default to null if not available
            restaurantEmail: aboutInfo.email || null, // Default to null if not available
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error fetching admin info:", error);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = getAdminInfo;
