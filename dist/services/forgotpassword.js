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
const sendForgotPassword = (recipientEmail, verificationCode) => {
    // APPEND HTML FILE
    const htmlTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, "templates", "forgotpassword.html"), "utf8");
    const replaceVerificationCode = htmlTemplate.replace("{{verification_code}}", verificationCode);
    const mailOptions = {
        from: '"Swiftab Team" <no-reply@swiftab.com>',
        to: recipientEmail,
        subject: "Password Reset Verification",
        html: replaceVerificationCode,
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
module.exports = sendForgotPassword;
//# sourceMappingURL=forgotpassword.js.map