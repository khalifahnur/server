"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCancelledReservation = exports.getUserActiveReservation = exports.getAllUserReservation = void 0;
const Reservation = require("../../models/reservation");
const getAllUserReservation = async (req, res) => {
    const restaurantId = req.restaurantId;
    try {
        const reservations = await Reservation.find({ "restaurantInfo.restaurantId": restaurantId }, { reservationInfo: 1, status: 1, _id: 0 } // Select only reservationInfo and status
        );
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ error: "No reservations found" });
        }
        const formattedReservations = reservations.map((reservation) => ({
            _id: reservation._id,
            reservationInfo: reservation.reservationInfo,
            status: reservation.status,
        }));
        res.status(200).json(formattedReservations);
    }
    catch (error) {
        console.error("Error retrieving reservation:", error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving the reservation" });
    }
};
exports.getAllUserReservation = getAllUserReservation;
const getUserActiveReservation = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error retrieving reservation:", error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving the reservation" });
    }
};
exports.getUserActiveReservation = getUserActiveReservation;
const getUserCancelledReservation = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error retrieving reservation:", error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving the reservation" });
    }
};
exports.getUserCancelledReservation = getUserCancelledReservation;
//# sourceMappingURL=getuserreservation.js.map