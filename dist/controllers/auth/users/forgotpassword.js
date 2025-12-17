"use strict";
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
const forgotPsswd = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).send("User not found");
        // Generate verification code
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        //update the verification field in the db
        user.verificationCode = verificationCode;
        //also update the exp date in the db
        user.verificationCodeExpiration = Date.now() + 600000;
        await user.save();
        await sendForgotPassword(email, verificationCode);
        res.status(200).json({ message: "Verification code sent", data: email });
    }
    catch (error) {
        res.status(500).send("Error sending verification code");
    }
};
module.exports = forgotPsswd;
//# sourceMappingURL=forgotpassword.js.map