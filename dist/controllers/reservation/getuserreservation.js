"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCancelledReservation = exports.getUserActiveReservation = void 0;
const Reservation = require("../../models/reservation");
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