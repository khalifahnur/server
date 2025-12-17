"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../../models/order");
const getUserOrders = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate("restaurantId", "title restaurantName image location")
            .populate("reservationId", "reservationInfo.reservationID")
            .lean();
        if (!orders || orders.length === 0) {
            return res.status(200).json([]);
        }
        const formattedOrders = orders.map((order) => {
            const restaurant = order.restaurantId || {};
            const reservation = order.reservationId || {};
            return {
                _id: order._id,
                orderId: order.orderId,
                reservationId: reservation.reservationInfo?.reservationID || "N/A",
                tableNumber: order.tableNumber,
                menu: order.items || [],
                status: order.orderStatus || "placed",
                paid: order.paymentStatus || "unpaid",
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,
                restaurantName: restaurant.restaurantName || "Unknown Restaurant",
                restaurantImage: restaurant.image || null,
                restaurantLocation: restaurant.location || null,
                restaurantId: restaurant._id,
            };
        });
        return res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = getUserOrders;
//# sourceMappingURL=getUsersOrders.js.map