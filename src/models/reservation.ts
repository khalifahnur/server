import mongoose from "mongoose";
const { Schema, model } = mongoose;

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
  diningArea:{type:String,required:true}
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
},{timestamps:true});

reservationSchema.index({ status: 1,"reservationInfo.endTime": 1 ,"reservationInfo.bookingFor": 1 }); 

const Reservation = model("Reservation", reservationSchema);
module.exports = Reservation;
