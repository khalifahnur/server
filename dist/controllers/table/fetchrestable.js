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
const RestaurantLayout = require("../../models/restaurantlayout");
const FetchResTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId || typeof restaurantId !== 'string') {
            return res.status(400).json({ message: "Invalid or missing restaurantId" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurantId format" });
        }
        const restaurantLayoutData = yield RestaurantLayout.findById(restaurantId).lean();
        if (!restaurantLayoutData) {
            return res.status(404).json({ error: "Tables not found for this restaurant" });
        }
        res.status(200).json({
            message: 'Fetched tables successfully',
            restaurantLayoutData
        });
    }
    catch (error) {
        console.error("Error fetching restaurant tables:", error);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = FetchResTable;
