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
const Restaurant = require("../../models/restaurant");
const AdminAuth = require("../../models/admin");
const UploadImage_1 = require("../../lib/UploadImage");
const addRestaurantData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.body.data) {
            return res.status(400).json({ message: "Data is invalid or empty" });
        }
        const parsedData = JSON.parse(req.body.data);
        const { title, data } = parsedData;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "Data is invalid or empty" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }
        const uploadedImageUrl = yield (0, UploadImage_1.uploadImageToCloudinary)(req.file);
        data[0].image = uploadedImageUrl;
        const newRestaurant = new Restaurant({ title, data });
        const savedRestaurant = yield newRestaurant.save();
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (userId) {
            yield AdminAuth.findByIdAndUpdate(userId, {
                restaurantId: savedRestaurant._id,
            });
        }
        res.status(201).json({
            message: "Restaurant data added successfully",
            restaurant: savedRestaurant,
        });
    }
    catch (error) {
        console.error("Error adding restaurant data:", error);
        res.status(500).json({ message: "Error adding restaurant data", error });
    }
});
module.exports = addRestaurantData;
