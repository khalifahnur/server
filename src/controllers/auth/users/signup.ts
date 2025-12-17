import { Request, Response } from "express";

const User = require("../../../models/user");
import { hashPassword } from "../../../lib/hashPassword";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

module.exports = signUpUser;
