import { Request, Response } from "express";
import mongoose from "mongoose";

const Reservation = require("../../../models/reservation");

const updateStatusByUser = async (req: Request, res: Response) => {
  const { id, restaurantId, reservationId } = req.body;
  const {userId} = req.params;

  // Validate request input
  if (!userId || !id || !restaurantId || !reservationId) {
    return res.status(400).json({
      error: "Missing required fields: userId, id, restaurantId, or reservationId",
    });
  }

  try {
    // Validate id format (if `_id` is used)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid reservation ID format" });
    }

    // Find and update the reservation
    const updatedReservation = await Reservation.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        "restaurantInfo.restaurantId": restaurantId,
        "reservationInfo.userId": userId,
        "reservationInfo.reservationID": reservationId, // Fixed casing
      },
      { status: "cancelled" }, // Update status to "cancelled"
      { new: true } // Return the updated document
    );

    if (!updatedReservation) {
      return res.status(404).json({
        message: "Reservation not found or details do not match",
      });
    }

    // Respond with the updated reservation
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation status:", error);
    res.status(500).json({
      error: "An error occurred while updating the reservation",
    });
  }
};

module.exports = updateStatusByUser;
