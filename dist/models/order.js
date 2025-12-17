"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const MenuItemSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
});
const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    reservationId: {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
        required: true,
    },
    tableNumber: { type: String, required: true },
    items: { type: [MenuItemSchema], required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    orderStatus: {
        type: String,
        required: true,
        enum: ["placed", "served", "ready_to_pay", "completed", "cancelled"],
        default: "placed",
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    paymentMethod: {
        type: String,
        enum: ["card", "mpesa", "cash", "airtel_money"],
        default: null,
    },
    servedBy: { type: Schema.Types.ObjectId, ref: "Waiter", default: null },
}, { timestamps: true });
OrderSchema.index({ restaurantId: 1, orderStatus: 1, paymentStatus: 1 });
const Order = model("Order", OrderSchema);
module.exports = Order;
//# sourceMappingURL=order.js.map