"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reservation = require("../../../models/reservation");
const userCancelledReservation = async (req, res) => {
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
        const responseData = reservations.map((reservation) => ({
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
    }
    catch (error) {
        console.error("Error retrieving cancelled reservation:", error);
        res
            .status(500)
            .json({
            error: "An error occurred while retrieving cancelled reservation",
        });
    }
};
module.exports = userCancelledReservation;
//# sourceMappingURL=cancelled.js.map