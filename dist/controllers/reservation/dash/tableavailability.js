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
const Reservation = require("../../../models/reservation");
const TableLayout = require("../../../models/restaurantlayout");
const tableAvailability = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split("T")[0];
        // Fetch today's active reservations for the restaurant
        const activeReservations = yield Reservation.countDocuments({
            "restaurantInfo.restaurantId": restaurantId,
            "reservationInfo.bookingFor": {
                $gte: new Date(today),
                $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
            },
            status: "active",
        });
        //fetch all the total tables for that restaurant
        const totalTable = yield TableLayout.findOne({
            restaurantId: restaurantId,
        });
        const totalTables = totalTable.tablePosition.length;
        //calculate remained active table
        const activeTables = totalTables.length - activeReservations;
        return { totalTables, activeTables };
    }
    catch (error) {
        console.error("Error checking availability:", error);
    }
});
module.exports = tableAvailability;
