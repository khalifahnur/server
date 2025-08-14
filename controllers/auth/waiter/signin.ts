import getSecretKey from "../../../lib/getSecretKey";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const sendSigninEmail = require('../../../services/waitersignin')
const Waiter = require('../../../models/waiter');


const loginWaiter = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const waiter = await Waiter.findOne({ email });

    if (!waiter) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, waiter.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const secretKey = await getSecretKey(waiter._id.toString());
    const token = jwt.sign({ userId: waiter._id }, secretKey, {
      expiresIn: "24h",
    });
    // Send email
    await sendSigninEmail(email);

    return res.status(200).json({
      token,
      waiter: {
        restaurantId: waiter.restaurantId,
        firstname: waiter.firstname,
        lastname: waiter.lastname,
        phoneNumber: waiter.phoneNumber,
        email:waiter.email
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Error occurred during login" });
    console.log("Error occurred during login:", error);
  }
};

module.exports = loginWaiter;
