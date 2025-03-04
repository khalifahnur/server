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
const RestaurantLayout = require("../../models/restaurantlayout");
const FetchRestaurantTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.restaurantId;
    try {
        if (!restaurantId) {
            return res.status(404).json({ message: "restaurant id not found" });
        }
        const restaurantLayoutData = yield RestaurantLayout.findById(restaurantId).lean();
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
});
module.exports = FetchRestaurantTables;
