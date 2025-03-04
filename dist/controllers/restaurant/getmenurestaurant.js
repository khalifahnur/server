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
const Restaurant = require('../../models/restaurant');
const getMenuByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const restaurantId = req.restaurantId;
    try {
        if (!restaurantId) {
            return res.status(400).json({ error: "No restaurantId provided" });
        }
        const restaurant = yield Restaurant.findOne({ _id: restaurantId }, { "data.menu": 1 } // Only return the menu field from data
        );
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        if (!restaurant.data || !restaurant.data.length || !((_a = restaurant.data[0]) === null || _a === void 0 ? void 0 : _a.menu)) {
            return res.status(404).json({ error: "Menu not found for this restaurant" });
        }
        const menu = restaurant.data[0].menu;
        res.status(200).json({ menu });
    }
    catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = getMenuByRestaurant;
