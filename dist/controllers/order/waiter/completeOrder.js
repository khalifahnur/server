"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../../models/order");
const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate({ _id: orderId }, { orderStatus: status }, { paymentStatus }, { new: true });
        // Optional: Emit Socket.io event here for real-time updates
        // req.io.to(reservationId).emit('status_changed', { status });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({
            success: true,
            data: updatedOrder,
            message: `Order status updated to ${status} and order paid`
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = completeOrder;
//# sourceMappingURL=completeOrder.js.map