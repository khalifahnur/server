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
const FetchRestaurantInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.restaurantId;
        if (!restaurantId) {
            return res.status(400).json({ message: "Restaurant ID is required" });
        }
        const restaurantLayoutInfo = yield RestaurantLayout.findById(restaurantId);
        if (!restaurantLayoutInfo) {
            return res.status(404).json({ message: "Dining areas not found" });
        }
        res.status(200).json({ diningAreas: restaurantLayoutInfo.diningAreas });
    }
    catch (e) {
        console.error("An error occurred when fetching restaurant layout:", e);
        res.status(500).json({ message: "Error fetching restaurant layout" });
    }
});
module.exports = FetchRestaurantInfo;
