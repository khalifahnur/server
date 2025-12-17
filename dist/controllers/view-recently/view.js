"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserView = require("../../models/userviews");
const postRecentlyView = async (req, res) => {
    const { restaurantId, userId } = req.body;
    try {
        if (!restaurantId && !userId) {
            res.status(404).json({ message: "restaurantId and userId are required" });
        }
        const view = new UserView({ userId, restaurantId });
        await view.save();
        res.status(200).json({ success: true });
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = postRecentlyView;
//# sourceMappingURL=view.js.map