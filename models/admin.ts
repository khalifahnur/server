import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema({
  provider: String,            // 'google' or 'x'
  providerId: String,          // provider-specific id
  email: { type: String, index: true, sparse: true },
  name: String,
  firstName:String,
  lastName:String,
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  // name: { type: String, required: true },
  // email: { type: String, required: true, unique: true },
  password: { type: String },
  phoneNumber:{type:String},
  // createdAt: { type: Date, default: Date.now },
  restaurantId: { type: String, default: null },
  verificationCode: { type: String },
  verificationCodeExpiration: { type: Date },
},{timestamps:true});

const Admin = model("Admin", adminSchema);
module.exports = Admin;
