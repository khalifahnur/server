"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reservation = require("../../../models/reservation");
const fetchReservations = async (req, res) => {
    const restaurantId = req.restaurantId;
    if (!restaurantId) {
        return res.status(400).json({ error: "Restaurant ID is required" });
    }
    try {
        const reservations = await Reservation.find({ restaurantId }, { reservationInfo: 1, status: 1, _id: 1 })
            .sort({ "reservationInfo.bookingFor": 1 })
            .limit(500)
            .lean();
        if (!reservations || reservations.length === 0) {
            return res.status(200).json([]);
        }
        const formattedReservations = reservations.map((reservation) => ({
            _id: reservation._id,
            name: reservation.reservationInfo?.name,
            email: reservation.reservationInfo?.email,
            phoneNumber: reservation.reservationInfo?.phoneNumber,
            start: reservation.reservationInfo?.bookingFor,
            end: reservation.reservationInfo?.endTime,
            guests: reservation.reservationInfo?.guests,
            table: reservation.reservationInfo?.tableNumber,
            floor: reservation.reservationInfo?.diningArea,
            status: reservation.status,
        }));
        res.status(200).json(formattedReservations);
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while retrieving reservations" });
    }
};
module.exports = fetchReservations;
//# sourceMappingURL=reservations.js.map