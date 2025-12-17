"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reservation = require("../../models/reservation");
const TableLayout = require("../../models/restaurantlayout");
const checkAvailability = async (req, res) => {
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
        const activeReservations = await Reservation.find({
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
        const restaurantLayout = await TableLayout.findById(restaurantId);
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
};
module.exports = checkAvailability;
//# sourceMappingURL=fetchavailabletables.js.map