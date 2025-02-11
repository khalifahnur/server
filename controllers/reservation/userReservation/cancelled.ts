import { Request, Response } from "express";

const Reservation = require("../../../models/reservation");

interface RestaurantInfo {
  restaurantId: string;
  restaurantName: string;
  image: string;
  location: string;
  longitude: string;
  latitude: string;
  rate: string;
}

interface ReservationInfo {
  reservationID?: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  bookingDate: Date;
  bookingFor: Date;
  endTime: Date;
  guest: number;
  tableNumber: string;
  diningArea: string;
}

interface Reservation {
  restaurantInfo: RestaurantInfo;
  reservationInfo: ReservationInfo;
  status: "active" | "cancelled" | "completed";
}

const userCancelledReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const reservations = await Reservation.find({
      "reservationInfo.userId": userId,
      status: "cancelled",
    }).lean();

    if (reservations.length === 0) {
      return res.status(200).json([]);
    }

    const responseData = reservations.map((reservation: Reservation) => ({
      date: new Date(reservation.reservationInfo.bookingFor)
        .toISOString()
        .split("T")[0],
      time: new Date(reservation.reservationInfo.bookingFor).getTime(),
      location: reservation.restaurantInfo.location,
      rate: reservation.restaurantInfo.rate,
      image: reservation.restaurantInfo.image,
      restaurantName: reservation.restaurantInfo.restaurantName,
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error retrieving cancelled reservation:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving cancelled reservation",
      });
  }
};

module.exports = userCancelledReservation;
