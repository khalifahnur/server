import { Request, Response } from "express";

const Order = require("../../../models/order");

const completeOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, paymentMethod } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status,
        paymentMethod:paymentMethod 
      },
      { new: true }
    );

    // Optional: Emit Socket.io event here for real-time updates
    // req.io.to(reservationId).emit('status_changed', { status });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: `Wait for the assigned waiter to complete payment`
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = completeOrder;
