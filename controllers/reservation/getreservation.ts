import { Request, Response } from "express";

const Reservation = require("../../models/reservation");

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

const getResActiveReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const reservations = await Reservation.find({
      "userInfo.userId": userId,
      status: "active",
    });

    if (!reservations|| reservations.length === 0) {
      return res.status(404).json({ error: "No active reservation found" });
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
    console.error("Error retrieving reservation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the reservation" });
  }
};

const getResCompleteReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;
    console.log(userId)
  try {
    const reservation = await Reservation.find({
      "userInfo.userId": userId,
      status: "completed",
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error retrieving reservation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the reservation" });
  }
};

const getResCancelledReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const reservation = await Reservation.findOne({
      "userInfo.userId": userId,
      status: "cancelled",
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error retrieving reservation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the reservation" });
  }
};

module.exports = {
  getResActiveReservation,
  getResCompleteReservation,
  getResCancelledReservation,
};
