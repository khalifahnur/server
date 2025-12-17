import { Request, Response } from "express";
const Reservation = require("../../../models/reservation");

const userActiveReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const reservations = await Reservation.find({
      userId,
      status: "active",
    })
      .populate("restaurantId")
      .lean();

    if (reservations.length === 0) {
      return res.status(200).json([]);
    }

    const responseData = reservations.map((reservation: any) => {
      const restaurant = reservation.restaurantId || {};

      const restaurantDetails =
        Array.isArray(restaurant.data) && restaurant.data[0]
          ? restaurant.data[0]
          : {};

      return {
        id: reservation._id,
        reservationId: reservation.reservationInfo?.reservationID || "N/A",

        date: new Date(reservation.reservationInfo.bookingFor)
          .toISOString()
          .split("T")[0],

        time: new Date(
          reservation.reservationInfo.bookingFor
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        table:reservation.reservationInfo.tableNumber,

        restaurantName:
          restaurant.title || restaurant.restaurantName || "Unknown Restaurant",

        image: restaurantDetails.image || restaurant.image || "",
        location: restaurantDetails.location || restaurant.location || "",
        rate: restaurantDetails.rate || restaurant.rate || "0",

        restaurantId: restaurant._id,
      };
    });

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = userActiveReservation;
