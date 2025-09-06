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

const templatePath = path.join(__dirname, "templates", "validation.html");
const htmlTemplate = fs.readFileSync(templatePath, "utf8");

const sendWaiterValidationCode = (recipientEmail: string, verificationCode: string) => {
  return new Promise<void>((resolve, reject) => {
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
