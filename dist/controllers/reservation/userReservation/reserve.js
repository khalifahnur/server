"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateReservationID_1 = require("../../../lib/GenerateReservationID");
const mongoose_1 = __importDefault(require("mongoose"));
const Reservation = require("../../../models/reservation");
const sendExpoNotification = require("../../../expo_push/sendExpoNotification");
const createReservation = async (req, res) => {
    const { userId, restaurantId, fcmToken } = req.params;
    const { data } = req.body;
    if (!restaurantId || !userId) {
        return res.status(400).json({ message: "Missing restaurantId or userId parameters" });
    }
    if (!data?.reservationInfo) {
        return res.status(400).json({ message: "Invalid reservation data: Missing reservationInfo" });
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const requestedStartTime = new Date(data.reservationInfo.bookingFor);
        const requestedEndTime = new Date(data.reservationInfo.endTime);
        const tableNum = data.reservationInfo.tableNumber;
        const existingReservation = await Reservation.findOne({
            restaurantId: restaurantId,
            "reservationInfo.tableNumber": tableNum,
            status: { $in: ["active", "seated"] },
            $or: [
                {
                    "reservationInfo.bookingFor": { $lt: requestedEndTime },
                    "reservationInfo.endTime": { $gt: requestedStartTime }
                }
            ]
        }).session(session);
        if (existingReservation) {
            await session.abortTransaction();
            return res.status(409).json({
                message: "This table was just booked by another user.",
                conflictDetails: { tableNumber: tableNum }
            });
        }
        const reservationID = (0, GenerateReservationID_1.GenerateReservationID)({
            restaurantId,
            bookingFor: data.reservationInfo.bookingFor,
            endTime: data.reservationInfo.endTime,
        });
        const newReservation = new Reservation({
            restaurantId: restaurantId,
            userId: userId,
            status: "active",
            reservationInfo: {
                ...data.reservationInfo,
                reservationID: reservationID,
                guests: Number(data.reservationInfo.guests),
            },
        });
        const savedReservation = await newReservation.save({ session });
        await session.commitTransaction();
        const bookingDate = new Date(savedReservation.reservationInfo.bookingFor);
        const timeString = bookingDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        const startTime = bookingDate.getTime();
        const endTime = new Date(savedReservation.reservationInfo.endTime).getTime();
        const durationInHours = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2);
        const responseData = {
            reservationId: reservationID,
            name: savedReservation.reservationInfo.name,
            date: bookingDate.toISOString().split("T")[0],
            time: timeString,
            duration: durationInHours,
            guests: savedReservation.reservationInfo.guests,
            tableNumber: savedReservation.reservationInfo.tableNumber,
            floor: savedReservation.reservationInfo.diningArea,
        };
        console.log("Reservation Success:", responseData);
        // Send notification (outside transaction)
        if (fcmToken) {
            try {
                const title = "✅ Reservation Confirmed!";
                const body = `🎉 Your reservation is confirmed for ${responseData.date} at ${responseData.time}. 🍽️`;
                await sendExpoNotification(fcmToken, title, body, {
                    reservationId: reservationID,
                    guest: String(savedReservation.reservationInfo.guests),
                });
            }
            catch (notifyError) {
                console.warn("Failed to send notification:", notifyError);
            }
        }
        else {
            console.warn("No device token provided for notification.");
        }
        return res.status(201).json({
            message: "Successfully reserved",
            responseData
        });
    }
    catch (error) {
        console.error("Error creating reservation:", error);
        // Rollback transaction on error
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        // Handle specific error types
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate reservation detected"
            });
        }
        return res.status(500).json({
            message: "An error occurred while creating the reservation",
            error: error instanceof Error ? error.message : String(error),
        });
    }
    finally {
        await session.endSession();
    }
};
module.exports = createReservation;
//# sourceMappingURL=reserve.js.map