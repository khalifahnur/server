import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserViewSchema = new Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
});

const UserView = mongoose.model("UserView", UserViewSchema);
module.exports = UserView;
