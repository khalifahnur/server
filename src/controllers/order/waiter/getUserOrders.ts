import { Request, Response } from "express";
import moment from "moment";
const Reservation = require("../../../models/reservation");

const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
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

    const formattedData = reservations.map((res: any) => {
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
        paymentMethod:order.paymentMethod || '',
        paymentStatus:order.paymentStatus,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error fetching orders" 
    });
  }
};

module.exports = getUserOrders ;