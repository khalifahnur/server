"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const reservationInformationSchema = new Schema({
    reservationID: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    bookingFor: { type: Date, required: true },
    endTime: { type: Date, required: true },
    guests: { type: Number, required: true },
    tableNumber: { type: String, required: true },
    diningArea: { type: String, required: true }
});
const reservationSchema = new Schema({
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reservationInfo: { type: reservationInformationSchema, required: true },
    userOrder: { type: Schema.Types.ObjectId, ref: 'Order', default: null },
    status: {
        type: String,
        required: true,
        enum: ["active", "cancelled", "completed", "seated"],
        default: "active",
    },
}, { timestamps: true });
reservationSchema.index({ status: 1, "reservationInfo.endTime": 1, "reservationInfo.bookingFor": 1 });
const Reservation = model("Reservation", reservationSchema);
module.exports = Reservation;
//# sourceMappingURL=reservation.js.map