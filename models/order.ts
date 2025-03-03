import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MenuItemSchema = new Schema({
  _id: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
});

const OrderSchema = new Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  reservationId: { type: String, required: true },
  tableNumber: { type: String, required: true },
  // diningArea: { type: String, required: true },
  menu: { type: [MenuItemSchema], required: true },
  status: {
    type: String,
    required: true,
    enum: ["Served", "Not-served"],
    default: "Not-served",
  },
  paid: {
    type: String,
    required: true,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  },
  takenBy: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

OrderSchema.index({ restaurantId: 1, status: 1, paid:1, createdAt:1 });

const Order = model("Order", OrderSchema);
module.exports = Order;
