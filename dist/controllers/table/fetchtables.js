"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestaurantLayout = require("../../models/restaurantlayout");
const FetchRestaurantTables = async (req, res) => {
    const restaurantId = req.restaurantId;
    try {
        if (!restaurantId) {
            return res.status(404).json({ message: "restaurant id not found" });
        }
        const restaurantLayoutData = await RestaurantLayout.findById(restaurantId).lean();
        if (!restaurantLayoutData) {
            return res
                .status(404)
                .json({ error: "tables not found for this restaurant" });
        }
        res.status(200).json({ message: 'fetched tables', restaurantLayoutData });
    }
    catch (error) {
        console.error("Error fetching restaurant layout:", error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = FetchRestaurantTables;
//# sourceMappingURL=fetchtables.js.map