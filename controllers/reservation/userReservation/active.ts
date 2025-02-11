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
  _id:string;
  restaurantInfo: RestaurantInfo;
  reservationInfo: ReservationInfo;
  status: "active" | "cancelled" | "completed";
}

const userActiveReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const reservations = await Reservation.find({
      "reservationInfo.userId": userId,
      status: "active",
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
      reservationId:reservation.reservationInfo.reservationID,
      restaurantId:reservation.restaurantInfo.restaurantId,
      id:reservation._id
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error retrieving reservation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the reservation" });
  }
};

module.exports = userActiveReservation;
