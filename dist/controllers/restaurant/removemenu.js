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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Restaurant = require("../../models/restaurant");
const deleteMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { menuType, itemId } = req.params;
    const restaurantId = req.restaurantId;
    try {
        const validMenuTypes = ["breakfast", "lunch", "dinner"];
        if (!validMenuTypes.includes(menuType)) {
            return res.status(400).json({ message: "Invalid menu type" });
        }
        const updatePath = `data.0.menu.${menuType}`;
        const updatedRestaurant = yield Restaurant.findOneAndUpdate({ _id: restaurantId }, {
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
});
module.exports = deleteMenuItem;
