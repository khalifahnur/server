"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reservation = require("../../../models/reservation");
const userCancelledReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        const reservations = yield Reservation.find({
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
});
module.exports = userCancelledReservation;
