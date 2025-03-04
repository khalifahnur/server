"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const waiterSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    phoneNumber: { type: String, required: true },
    restaurantId: { type: String, default: null },
    validationcode: { type: String },
    verificationCode: { type: String },
    verificationCodeExpiration: { type: Date },
    validationcodeExpiration: { type: Date },
    createdAt: { type: Date, default: Date.now },
});
const waiter = model("Waiter", waiterSchema);
module.exports = waiter;
