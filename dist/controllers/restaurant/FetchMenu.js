"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Restaurant = require("../../models/restaurant");
const getMenuByRestaurantId = async (req, res) => {
    const { restaurantId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid Restaurant ID format' });
    }
    try {
        const restaurantDoc = await Restaurant.findById(restaurantId);
        if (!restaurantDoc || !restaurantDoc.data || restaurantDoc.data.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const targetRestaurant = restaurantDoc.data[0];
        const menu = targetRestaurant.menu;
        return res.status(200).json(menu);
    }
    catch (error) {
        console.error('Error fetching menu:', error);
        return res.status(500).json({ message: 'Server error retrieving menu' });
    }
};
module.exports = getMenuByRestaurantId;
//# sourceMappingURL=FetchMenu.js.map