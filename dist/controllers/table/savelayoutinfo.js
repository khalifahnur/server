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
const SaveLayoutInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.restaurantId;
        if (!restaurantId) {
            return res.status(400).json({ message: "Restaurant ID is required" });
        }
        const { diningAreas, tableCapacity, totalTables } = req.body;
        if (!diningAreas) {
            return res.status(400).json({ message: "Dining areas are required" });
        }
        const layoutInfo = yield RestaurantLayout.findByIdAndUpdate(restaurantId, { restaurantId, diningAreas, tableCapacity, totalTables }, { new: true, upsert: true });
        if (!layoutInfo) {
            return res.status(404).json({ message: "Layout information not found" });
        }
        res.status(200).json({
            message: "Layout updated successfully",
            layout: {
                diningAreas: layoutInfo.diningAreas,
                totalCapacity: layoutInfo.totalCapacity,
                totalTables: layoutInfo.totalTables,
            },
        });
    }
    catch (error) {
        console.error("Error saving layout info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = SaveLayoutInfo;
