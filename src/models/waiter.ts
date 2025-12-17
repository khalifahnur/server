import mongoose from "mongoose";
const { Schema, model } = mongoose;

const waiterSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default:null},
  phoneNumber:{type:String,required: true},
  restaurantId: { type: String, default: null },
  validationcode:{ type: String },
  verificationCode: { type: String },
  verificationCodeExpiration: { type: Date },
  validationcodeExpiration: { type: Date },
},{timestamps:true});

const waiter = model("Waiter", waiterSchema);
module.exports = waiter;
