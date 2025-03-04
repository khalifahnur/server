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
const updateMenuItemCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, menuType, itemId } = req.params;
    const { cost } = req.body;
    // Validate the cost
    if (cost === undefined || typeof cost !== 'number') {
        return res.status(400).json({ message: 'Invalid or missing cost' });
    }
    try {
        // Determine the correct path based on menuType
        let updatePath;
        if (menuType === 'breakfast') {
            updatePath = 'data.0.menu.0.breakfast';
        }
        else if (menuType === 'lunch') {
            updatePath = 'data.0.menu.0.lunch';
        }
        else if (menuType === 'dinner') {
            updatePath = 'data.0.menu.0.dinner';
        }
        else {
            return res.status(400).json({ message: 'Invalid menu type' });
        }
        // Find the restaurant document and update only the cost of the specific menu item
        const updatedRestaurant = yield Restaurant.findOneAndUpdate({
            _id: id,
            [`${updatePath}._id`]: itemId // Match the specific menu item by its ID
        }, {
            $set: {
                [`${updatePath}.$.cost`]: cost // Update only the cost field of the matched menu item
            }
        }, { new: true });
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant or menu item not found' });
        }
        res.status(200).json({ message: 'Menu item cost updated successfully', restaurant: updatedRestaurant });
    }
    catch (error) {
        console.error('Error updating menu item cost:', error);
        res.status(500).json({ message: 'Error updating menu item cost', error });
    }
});
module.exports = updateMenuItemCost;
