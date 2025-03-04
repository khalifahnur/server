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
const SaveTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tables } = req.body;
    const restaurantId = req.restaurantId;
    if (!restaurantId) {
        return res.status(400).json({ message: "Restaurant ID is required" });
    }
    if (!tables || !Array.isArray(tables)) {
        return res.status(400).json({ message: "Tables data must be an array" });
    }
    try {
        // Find the existing RestaurantLayout or create a new one
        const layout = yield RestaurantLayout.findOne({ restaurantId });
        // If the layout exists, update the tablePosition array
        if (layout) {
            layout.tablePosition = tables.map((tableData) => (Object.assign({}, tableData)));
            yield layout.save();
            return res.status(200).json({
                message: "Tables updated successfully",
                tables: layout.tablePosition,
            });
        }
        else {
            // If no layout exists, create a new RestaurantLayout and save it
            const newLayout = new RestaurantLayout({
                restaurantId,
                tablePosition: tables.map((tableData) => (Object.assign({}, tableData))),
            });
            yield newLayout.save();
            return res.status(201).json({
                message: "Restaurant layout created and tables saved successfully",
                tables: newLayout.tablePosition,
            });
        }
    }
    catch (error) {
        console.error("Error saving tables:", error);
        return res.status(500).json({ message: "Failed to save tables", error });
    }
});
module.exports = SaveTables;
