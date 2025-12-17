"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Restaurant = require('../../models/restaurant');
const getMenuByRestaurant = async (req, res) => {
    const restaurantId = req.restaurantId;
    try {
        if (!restaurantId) {
            return res.status(400).json({ error: "No restaurantId provided" });
        }
        const restaurant = await Restaurant.findOne({ _id: restaurantId }, { "data.menu": 1 } // Only return the menu field from data
        );
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        if (!restaurant.data || !restaurant.data.length || !restaurant.data[0]?.menu) {
            return res.status(404).json({ error: "Menu not found for this restaurant" });
        }
        const menu = restaurant.data[0].menu;
        res.status(200).json({ menu });
    }
    catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = getMenuByRestaurant;
//# sourceMappingURL=getmenurestaurant.js.map