import { Request, Response } from "express";
import { hashPassword } from "../../../lib/hashPassword";
const User = require("../../../models/user");

const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("User not found");

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    user.verificationCode = null;
    user.verificationCodeExpiration = null;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send("Error updating password");
  }
};

module.exports = resetPassword;
