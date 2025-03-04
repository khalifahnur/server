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
const sendWaiterSigninEmail = (recipientEmail) => {
    // APPEND HTML FILE
    const htmlTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, "templates", "waitersignin.html"), "utf8");
    const personalizedHtmlTemplate = htmlTemplate.replace("{{email}}", recipientEmail);
    const mailOptions = {
        from: '"Swiftab Team" <no-reply@swiftab.com>',
        to: recipientEmail,
        subject: "Swiftab Waiter Sign-In Verification",
        html: personalizedHtmlTemplate,
    };
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        }
        else {
            console.log("Email sent: %s", info.messageId);
        }
    });
};
module.exports = sendWaiterSigninEmail;
