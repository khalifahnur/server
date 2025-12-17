import { Request, Response } from 'express';
import { hashPassword } from "../../../lib/hashPassword";
const AdminAuth = require('../../../models/admin');


const signUpAdmin = async (req:Request, res:Response) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    console.log("Received request body:", req.body);

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await AdminAuth.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new AdminAuth({
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

module.exports = signUpAdmin;
