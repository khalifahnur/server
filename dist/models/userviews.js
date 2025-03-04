"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const UserViewSchema = new Schema({
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
});
const UserView = mongoose_1.default.model("UserView", UserViewSchema);
module.exports = UserView;
