"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestaurantLayout = require("../../models/restaurantlayout");
const SaveTables = async (req, res) => {
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
        const layout = await RestaurantLayout.findOne({ restaurantId });
        // If the layout exists, update the tablePosition array
        if (layout) {
            layout.tablePosition = tables.map((tableData) => ({
                ...tableData,
            }));
            await layout.save();
            return res.status(200).json({
                message: "Tables updated successfully",
                tables: layout.tablePosition,
            });
        }
        else {
            // If no layout exists, create a new RestaurantLayout and save it
            const newLayout = new RestaurantLayout({
                restaurantId,
                tablePosition: tables.map((tableData) => ({
                    ...tableData,
                })),
            });
            await newLayout.save();
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
};
module.exports = SaveTables;
//# sourceMappingURL=savetables.js.map