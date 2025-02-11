import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber:{type:String,required: true},
  createdAt: { type: Date, default: Date.now },
  verificationCode: { type: String },
  verificationCodeExpiration: { type: Date },
});

const User = model("User", userSchema);
module.exports = User;
