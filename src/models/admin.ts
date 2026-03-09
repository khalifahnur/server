import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema({
  email: { type: String, index: true, sparse: true },
  name: {type:String},
  password: { type: String },
  phoneNumber:{type:String},
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant',default: null },
  verificationCode: { type: String },
  verificationCodeExpiration: { type: Date },
},{timestamps:true});

adminSchema.index({email:1,restaurantId:1})

const Admin = model("Admin", adminSchema);
module.exports = Admin;
