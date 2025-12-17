"use strict";
const Order = require("../../../models/order");
const getTotalRevenue = async (restaurantId) => {
    try {
        const revenue = await Order.aggregate([
            { $match: { paid: "Paid", restaurantId } },
            { $unwind: "$menu" },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$menu.cost", "$menu.quantity"] } },
                },
            },
        ]);
        return revenue[0]?.totalRevenue || 0;
    }
    catch (error) {
        console.error("Error calculating total revenue:", error);
    }
};
module.exports = getTotalRevenue;
//# sourceMappingURL=totalrevenue.js.map