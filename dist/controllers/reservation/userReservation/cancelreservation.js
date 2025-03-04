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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Reservation = require("../../../models/reservation");
const updateStatusByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, restaurantId, reservationId } = req.body;
    const { userId } = req.params;
    // Validate request input
    if (!userId || !id || !restaurantId || !reservationId) {
        return res.status(400).json({
            error: "Missing required fields: userId, id, restaurantId, or reservationId",
        });
    }
    try {
        // Validate id format (if `_id` is used)
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid reservation ID format" });
        }
        // Find and update the reservation
        const updatedReservation = yield Reservation.findOneAndUpdate({
            _id: new mongoose_1.default.Types.ObjectId(id),
            "restaurantInfo.restaurantId": restaurantId,
            "reservationInfo.userId": userId,
            "reservationInfo.reservationID": reservationId, // Fixed casing
        }, { status: "cancelled" }, // Update status to "cancelled"
        { new: true } // Return the updated document
        );
        if (!updatedReservation) {
            return res.status(404).json({
                message: "Reservation not found or details do not match",
            });
        }
        // Respond with the updated reservation
        res.status(200).json(updatedReservation);
    }
    catch (error) {
        console.error("Error updating reservation status:", error);
        res.status(500).json({
            error: "An error occurred while updating the reservation",
        });
    }
});
module.exports = updateStatusByUser;
