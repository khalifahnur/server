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
const UploadImage_1 = require("../../lib/UploadImage");
const Restaurant = require("../../models/restaurant");
const addMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { menuType } = req.params;
    const newMenuItem = req.body;
    const restaurantId = req.restaurantId;
    if (!newMenuItem || !newMenuItem.name || !newMenuItem.cost) {
        return res.status(400).json({ message: "Invalid menu item data" });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
    }
    const uploadedImageUrl = yield (0, UploadImage_1.uploadMenuToCloudinary)(req.file);
    newMenuItem.image = uploadedImageUrl;
    try {
        let updatePath;
        if (menuType === "breakfast") {
            updatePath = "data.0.menu.breakfast";
        }
        else if (menuType === "lunch") {
            updatePath = "data.0.menu.lunch";
        }
        else if (menuType === "dinner") {
            updatePath = "data.0.menu.dinner";
        }
        else {
            return res.status(400).json({ message: "Invalid menu type" });
        }
        const updatedRestaurant = yield Restaurant.findByIdAndUpdate(restaurantId, { $push: { [updatePath]: newMenuItem } }, { new: true });
        if (!updatedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(201).json({ message: "Menu item added successfully" });
    }
    catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({ message: "Error adding menu item", error });
    }
});
module.exports = addMenu;
