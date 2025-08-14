import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema({
  provider: {type:String}, 
  providerId: {type:String},
  email: { type: String, index: true, sparse: true },
  name: {type:String},
  firstName:String,
  lastName:String,
  avatar: String,
  // createdAt: { type: Date, default: Date.now },
  password: { type: String },
  phoneNumber:{type:String},
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant',default: null },
  verificationCode: { type: String },
  verificationCodeExpiration: { type: Date },
},{timestamps:true});

adminSchema.index({email:1,restaurantId:1,_id:1})

const Admin = model("Admin", adminSchema);
module.exports = Admin;
