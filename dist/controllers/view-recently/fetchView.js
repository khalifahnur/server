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
const UserView = require("../../models/userviews");
const Restaurant = require("../../models/restaurant");
const fetchRecentlyView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log(userId);
        const recentlyViewed = yield UserView.find({ userId })
            .sort({ viewedAt: -1 })
            .limit(10)
            .populate("restaurantId");
        const restaurantIds = recentlyViewed.map((item) => item.restaurantId);
        const restaurants = yield Restaurant.find({
            _id: { $in: restaurantIds },
        });
        res.status(200).json(restaurants);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Something went wrong" });
    }
});
module.exports = fetchRecentlyView;
