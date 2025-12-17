"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RestaurantLayout = require("../../models/restaurantlayout");
const FetchResTable = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId || typeof restaurantId !== 'string') {
            return res.status(400).json({ message: "Invalid or missing restaurantId" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurantId format" });
        }
        const restaurantLayoutData = await RestaurantLayout.findById(restaurantId).lean();
        if (!restaurantLayoutData) {
            return res.status(404).json({ error: "Tables not found for this restaurant" });
        }
        res.status(200).json({
            message: 'Fetched tables successfully',
            restaurantLayoutData
        });
    }
    catch (error) {
        console.error("Error fetching restaurant tables:", error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = FetchResTable;
//# sourceMappingURL=fetchrestable.js.map