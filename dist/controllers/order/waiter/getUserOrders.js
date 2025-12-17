"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Reservation = require("../../../models/reservation");
const getUserOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId) {
            return res.status(400).json({ message: "Restaurant ID is required" });
        }
        const startOfDay = (0, moment_1.default)().startOf('day').toDate();
        const endOfDay = (0, moment_1.default)().endOf('day').toDate();
        const reservations = await Reservation.find({
            restaurantId: restaurantId,
            "reservationInfo.bookingFor": {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: 'cancelled' }
        })
            .populate('userId', 'name phoneNumber')
            .populate('userOrder')
            .sort({ "reservationInfo.bookingFor": 1 });
        const formattedData = reservations.map((res) => {
            const order = res.userOrder || {};
            return {
                _id: order._id || '',
                tableNumber: res.reservationInfo?.tableNumber || "N/A",
                guests: res.reservationInfo?.guests || 0,
                time: res.reservationInfo?.bookingFor,
                status: order.orderStatus || "",
                items: order.items || [],
                totalAmount: order.totalAmount || 0,
                userId: res.userId,
                paymentMethod: order.paymentMethod || '',
                paymentStatus: order.paymentStatus,
            };
        });
        res.status(200).json({
            success: true,
            count: formattedData.length,
            data: formattedData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error fetching orders"
        });
    }
};
module.exports = getUserOrders;
//# sourceMappingURL=getUserOrders.js.map