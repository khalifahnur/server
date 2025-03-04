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
const TableLayout = require("../../models/restaurantlayout");
const checkAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId, bookingFor, endTime } = req.body;
        if (!restaurantId || !bookingFor || !endTime) {
            return res
                .status(400)
                .json({ error: "restaurantId, bookingFor, and endTime are required." });
        }
        const bookingStart = new Date(bookingFor);
        const bookingEnd = new Date(endTime);
        if (bookingEnd <= bookingStart) {
            return res
                .status(400)
                .json({ error: "endTime must be after bookingFor." });
        }
        // Fetch all active reservations for the restaurant
        const activeReservations = yield Reservation.find({
            "restaurantInfo.restaurantId": restaurantId,
            status: "active",
        });
        // Filter overlapping reservations
        const overlappingReservations = activeReservations.filter((reservation) => {
            const reservationStart = new Date(reservation.reservationInfo.bookingFor).getTime();
            const reservationEnd = new Date(reservation.reservationInfo.endTime).getTime();
            return (bookingStart.getTime() < reservationEnd &&
                bookingEnd.getTime() > reservationStart);
        });
        const reservedTables = overlappingReservations.map((res) => res.reservationInfo.tableNumber);
        const restaurantLayout = yield TableLayout.findById(restaurantId);
        const tables = restaurantLayout.tablePosition.map((table) => table.name);
        console.log(tables);
        // Determine availability
        const availability = tables.map((tableNumber) => ({
            tableNumber,
            isAvailable: !reservedTables.includes(tableNumber),
        }));
        return res.status(200).json({ availability, tables });
    }
    catch (error) {
        console.error("Error checking availability:", error);
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
module.exports = checkAvailability;
