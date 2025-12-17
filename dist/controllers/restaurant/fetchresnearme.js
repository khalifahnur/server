"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CalculateDistance_1 = __importDefault(require("../../lib/CalculateDistance"));
const Restaurant = require("../../models/restaurant");
const fetchrestaurantnearme = async (req, res) => {
    const { latitude, longitude } = req.body;
    const radius = 5;
    if (!latitude || !longitude) {
        return res
            .status(400)
            .json({ error: "Latitude and longitude are required." });
    }
    try {
        const restaurants = await Restaurant.find();
        const nearbyRestaurants = restaurants.filter((restaurant) => restaurant.data.some((data) => {
            const distance = (0, CalculateDistance_1.default)({
                lat1: parseFloat(latitude),
                lon1: parseFloat(longitude),
                lat2: data.latitude,
                lon2: data.longitude,
            });
            //console.log(distance)
            return distance <= radius;
        }));
        res.status(200).json(nearbyRestaurants);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch restaurants." });
    }
};
module.exports = fetchrestaurantnearme;
//# sourceMappingURL=fetchresnearme.js.map