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
const GenerateReservationID_1 = require("../../lib/GenerateReservationID");
const Reservation = require("../../models/reservation");
const sendFirebaseNotification = require("../../firebase/fcmService");
//const sendReservationNotification = require("../../kafka/producer/reservationProducer");
const reservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, restaurantId, fcmToken } = req.params;
    const { data } = req.body;
    if (!(data === null || data === void 0 ? void 0 : data.restaurantInfo) || !(data === null || data === void 0 ? void 0 : data.reservationInfo)) {
        return res.status(400).json({
            message: "Invalid reservation data structure",
        });
    }
    try {
        // Generate a unique reservation ID
        const reservationID = (0, GenerateReservationID_1.GenerateReservationID)({
            restaurantId,
            bookingFor: data.reservationInfo.bookingFor,
            endTime: data.reservationInfo.endTime,
        });
        // Create and save the reservation document
        const newReservation = new Reservation({
            restaurantInfo: Object.assign(Object.assign({}, data.restaurantInfo), { restaurantId }),
            reservationInfo: Object.assign(Object.assign({}, data.reservationInfo), { userId,
                reservationID }),
            status: "active",
        });
        const savedReservation = yield newReservation.save();
        // Extract and format reservation details
        const bookingDate = new Date(savedReservation.reservationInfo.bookingFor);
        const restaurantName = savedReservation.restaurantInfo.restaurantName;
        const time = bookingDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        const startTime = bookingDate.getTime();
        const endTime = new Date(savedReservation.reservationInfo.endTime).getTime();
        const durationInHours = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2);
        const responseData = {
            name: savedReservation.reservationInfo.name,
            date: bookingDate.toISOString().split("T")[0],
            time,
            duration: durationInHours,
            guest: savedReservation.reservationInfo.guest,
            tableNumber: savedReservation.reservationInfo.tableNumber,
            reservationId: reservationID,
            floor: savedReservation.reservationInfo.diningArea
        };
        console.log("responseData", responseData);
        const deviceToken = fcmToken;
        // const notificationData = {
        //   userId,
        //   deviceToken,
        //   reservationId: reservationID,
        //   date: responseData.date,
        //   time: responseData.time,
        //   guest: savedReservation.reservationInfo.guest,
        //   restaurantName
        // };
        // await sendReservationNotification(notificationData)
        // Expecting the device token in the request body
        if (!deviceToken) {
            console.warn("No device token provided for notification.");
        }
        else {
            const title = "Reservation Confirmed";
            const body = `Your reservation is confirmed for ${responseData.date} at ${responseData.time}.`;
            // Send Firebase Notification
            yield sendFirebaseNotification(deviceToken, title, body, {
                reservationId: reservationID,
                guest: String(savedReservation.reservationInfo.guest),
            });
        }
        res.status(201).json({ message: "successfully reserved", responseData });
    }
    catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({
            message: "An error occurred while creating the reservation",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
module.exports = reservation;
