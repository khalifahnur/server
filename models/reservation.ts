import mongoose from "mongoose";
const { Schema, model } = mongoose;

const restaurantInformationSchema = new Schema({
  restaurantId: { type: String, required: true },
  restaurantName: { type: String, required: true },
  image: { type: String },
  location: { type: String },
  longitude: { type: String },
  latitude: { type: String },
  rate: { type: String },
});

const reservationInformationSchema = new Schema({
  reservationID: { type: String },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  bookingFor: { type: Date, required: true },
  endTime: { type: Date, required: true },
  guest: { type: Number, required: true },
  tableNumber: { type: String, required: true },
  diningArea:{type:String,required:true}
});

const reservationSchema = new Schema({
  restaurantInfo: { type: restaurantInformationSchema, required: true },
  reservationInfo: { type: reservationInformationSchema, required: true },
  status: {
    type: String,
    required: true,
    enum: ["active", "cancelled", "completed"],
    default: "active",
  },
});

reservationSchema.index({ status: 1 }); // Index on top-level "status"
reservationSchema.index({ "reservationInfo.endTime": 1 }); // Index on nested "endTime"
reservationSchema.index({ "reservationInfo.bookingFor": 1 }); // Index on nested "bookingFor"

// Compound index for your cron job query (status + endTime)
reservationSchema.index({ status: 1, "reservationInfo.endTime": 1 });

const Reservation = model("Reservation", reservationSchema);
module.exports = Reservation;
