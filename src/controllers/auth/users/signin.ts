import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import getSecretKey from "../../../lib/getSecretKey";
import { verifyPassword } from "../../../lib/hashPassword";
const sendSigninEmail = require("../../../services/email");
const User = require("../../../models/user");

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const isPasswordMatch = verifyPassword(user.password, password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const secretKey = await getSecretKey(user._id.toString());
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "24h",
    });

    await sendSigninEmail(email);

    return res.status(200).json({
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred during login" });
  }
};

module.exports = loginUser;
