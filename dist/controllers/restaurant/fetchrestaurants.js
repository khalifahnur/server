"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Restaurant = require("../../models/restaurant");
const fetchallrestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res
            .status(200)
            .json({ message: "restaurants fetched successfully", restaurants });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch restaurants." });
    }
};
module.exports = fetchallrestaurants;
//# sourceMappingURL=fetchrestaurants.js.map