import { Request, Response } from "express";

const Order = require("../../../models/order");

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, servedBy } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      {_id:orderId},
      { orderStatus: status },
      { servedBy},
      { new: true }
    );

    // Optional: Emit Socket.io event here for real-time updates
    // req.io.to(reservationId).emit('status_changed', { status });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = updateOrderStatus;
