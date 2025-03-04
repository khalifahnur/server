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
const Order = require("../../models/order");
const fetchUnPaidOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    if (!restaurantId) {
        return res.status(400).json({ error: "RestaurantId is required" });
    }
    try {
        const orders = yield Order.find({
            restaurantId: restaurantId,
            paid: 'Unpaid'
        }).lean();
        if (orders.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json({ message: "successfully fetched orders", orders });
    }
    catch (error) {
        console.error("Error retrieving orders:", error);
        res
            .status(500)
            .json({ error: "An error occurred while orders the reservation" });
    }
});
module.exports = fetchUnPaidOrder;
