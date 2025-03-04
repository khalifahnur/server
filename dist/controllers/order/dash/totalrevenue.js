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
const Order = require("../../../models/order");
const getTotalRevenue = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const revenue = yield Order.aggregate([
            { $match: { paid: "Paid", restaurantId } },
            { $unwind: "$menu" },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$menu.cost", "$menu.quantity"] } },
                },
            },
        ]);
        return ((_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
    }
    catch (error) {
        console.error("Error calculating total revenue:", error);
    }
});
module.exports = getTotalRevenue;
