"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Restaurant = require("../../models/restaurant");
const deleteMenuItem = async (req, res) => {
    const { menuType, itemId } = req.params;
    const restaurantId = req.restaurantId;
    try {
        const validMenuTypes = ["breakfast", "lunch", "dinner"];
        if (!validMenuTypes.includes(menuType)) {
            return res.status(400).json({ message: "Invalid menu type" });
        }
        const updatePath = `data.0.menu.${menuType}`;
        const updatedRestaurant = await Restaurant.findOneAndUpdate({ _id: restaurantId }, {
            $pull: {
                [updatePath]: { _id: new mongoose_1.default.Types.ObjectId(itemId) },
            },
        }, { new: true });
        if (!updatedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        return res.status(200).json({ message: "Menu item deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting menu item:", error);
        return res.status(500).json({ message: "Error deleting menu item", error });
    }
};
module.exports = deleteMenuItem;
//# sourceMappingURL=removemenu.js.map