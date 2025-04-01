"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const waiterModel = require("../../../models/waiter");
const sendWaiterValidationCode = require("../../../services/validationcode");
const waiterSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, email, phoneNumber } = req.body;
        const restaurantId = req.restaurantId;
        if (!firstname || !lastname || !email || !phoneNumber) {
            console.log("Missing required field:", {
                firstname,
                lastname,
                email,
                phoneNumber,
                restaurantId,
            });
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = yield waiterModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "Waiter already exists" });
        }
        const validationcode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpiration = Date.now() + 600000;
        const newWaiter = new waiterModel({
            firstname,
            lastname,
            email,
            restaurantId,
            phoneNumber,
            validationcode,
            verificationCodeExpiration
        });
        yield newWaiter.save();
        yield sendWaiterValidationCode(email, validationcode);
        res.status(200).json({ message: "Waiter created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating waiter" });
        console.log("Error occurred during signup of waiter:", error);
    }
});
module.exports = waiterSignUp;
