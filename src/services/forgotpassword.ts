import fs from "fs";
import path from "path";
import nodemailer, { SentMessageInfo } from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendForgotPassword = (recipientEmail: string,verificationCode:string) => {
  // APPEND HTML FILE
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, "templates", "forgotpassword.html"),
    "utf8"
  );

  const replaceVerificationCode = htmlTemplate.replace(
    "{{verification_code}}",
    verificationCode
  )

  const mailOptions = {
    from: '"Swiftab Team" <no-reply@swiftab.com>',
    to: recipientEmail,
    subject: "Password Reset Verification",
    html: replaceVerificationCode,
  };

  // Send email
  transporter.sendMail(
    mailOptions,
    (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: %s", info.messageId);
      }
    }
  );
};

module.exports = sendForgotPassword;
