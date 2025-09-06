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
const Reservation = require("../../models/reservation");
const getResActiveReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        const reservations = yield Reservation.find({
            "userInfo.userId": userId,
            status: "active",
        });
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ error: "No active reservation found" });
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
        console.error("Error retrieving reservation:", error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving the reservation" });
    }
});
const getResCompleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log(userId);
    try {
        const reservation = yield Reservation.find({
            "userInfo.userId": userId,
            status: "completed",
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
});
const getResCancelledReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const reservation = yield Reservation.findOne({
            "userInfo.userId": userId,
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
});
module.exports = {
    getResActiveReservation,
    getResCompleteReservation,
    getResCancelledReservation,
};
