import { Request, Response } from "express";

const Reservation = require("../../models/reservation");

interface ReservationInfo {
  reservationID: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  bookingDate: string;
  bookingFor: string;
  endTime: string;
  guest: number;
  tableNumber: string;
  diningArea: string;
  _id: string;
}

interface ReservationParams {
  _id: string;
  reservationInfo: ReservationInfo;
  status: string;
}



export const getUserActiveReservation = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const reservation = await Reservation.findOne({
      "restaurantInfo.restaurantId": restaurantId,
      status: "active",
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

export const getUserCancelledReservation = async (
  req: Request,
  res: Response
) => {
  const { restaurantId } = req.params;

  try {
    const reservation = await Reservation.findOne({
      "restaurantInfo.restaurantId": restaurantId,
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
