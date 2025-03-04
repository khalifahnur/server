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
const reservation = require("../../../models/reservation");
const getTodayActiveReservation = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().toISOString().split("T")[0];
    try {
        const reservations = yield reservation.find({
            "restaurantInfo.restaurantId": restaurantId,
            "reservationInfo.bookingFor": {
                $gte: new Date(today),
                $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
            },
            status: "active",
        });
        const responseData = reservations.length;
        return responseData;
    }
    catch (error) {
        console.error("Error retrieving todays reservation:", error);
    }
});
module.exports = getTodayActiveReservation;
