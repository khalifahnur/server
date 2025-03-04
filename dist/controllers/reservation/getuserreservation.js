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
exports.getUserCancelledReservation = exports.getUserActiveReservation = exports.getAllUserReservation = void 0;
const Reservation = require("../../models/reservation");
const getAllUserReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.restaurantId;
    console.log(restaurantId);
    try {
        const reservations = yield Reservation.find({ "restaurantInfo.restaurantId": restaurantId }, { reservationInfo: 1, status: 1, _id: 0 } // Select only reservationInfo and status
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
});
exports.getAllUserReservation = getAllUserReservation;
const getUserActiveReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    try {
        const reservation = yield Reservation.findOne({
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
});
exports.getUserActiveReservation = getUserActiveReservation;
const getUserCancelledReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    try {
        const reservation = yield Reservation.findOne({
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
});
exports.getUserCancelledReservation = getUserCancelledReservation;
//module.exports = {getAllUserReservation,getUserActiveReservation,getUserCancelledReservation};
