"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
const templatePath = path_1.default.join(__dirname, "templates", "validation.html");
const htmlTemplate = fs_1.default.readFileSync(templatePath, "utf8");
const sendWaiterValidationCode = (recipientEmail, verificationCode) => {
    return new Promise((resolve, reject) => {
        const replaceVerificationCode = htmlTemplate.replace("{{verification_code}}", verificationCode);
        const mailOptions = {
            from: `"Swiftab Team" <${process.env.GMAIL_USER}>`,
            to: recipientEmail,
            subject: "Your Waiter Signup Verification Code",
            html: replaceVerificationCode,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return reject(error);
            }
            console.log("Email sent: %s", info.messageId);
            resolve();
        });
    });
};
module.exports = sendWaiterValidationCode;
