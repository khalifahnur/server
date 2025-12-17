"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserView = require("../../models/userviews");
const Restaurant = require("../../models/restaurant");
const fetchRecentlyView = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const recentlyViewed = await UserView.find({ userId })
            .sort({ viewedAt: -1 })
            .limit(10)
            .populate("restaurantId");
        const restaurantIds = recentlyViewed.map((item) => item.restaurantId);
        const restaurants = await Restaurant.find({
            _id: { $in: restaurantIds },
        });
        res.status(200).json(restaurants);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Something went wrong" });
    }
};
module.exports = fetchRecentlyView;
//# sourceMappingURL=fetchView.js.map