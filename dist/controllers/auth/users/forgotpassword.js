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
require("dotenv").config();
const sendForgotPassword = require('../../../services/forgotpassword');
const User = require('../../../models/user');
var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    secure: true,
});
const forgotPsswd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user)
            return res.status(404).send("User not found");
        // Generate verification code
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        //update the verification field in the db
        user.verificationCode = verificationCode;
        //also update the exp date in the db
        user.verificationCodeExpiration = Date.now() + 600000;
        yield user.save();
        yield sendForgotPassword(email, verificationCode);
        res.status(200).json({ message: "Verification code sent", data: email });
    }
    catch (error) {
        res.status(500).send("Error sending verification code");
    }
});
module.exports = forgotPsswd;
