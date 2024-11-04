import GenerateSecretKey from '../../../lib/GenerateSecretKey';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const AdminAuth = require('../../../models/admin');

// Ensure the key is being read correctly from the environment variables
const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminAuth.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect Email/Password" });
    }

    const token = jwt.sign({ userId: admin._id }, secretKey, {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
      user: {
        userId: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        restaurantId: admin.restaurantId || null, 
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred during login" });
    console.log("Error occurred during login:", error);
  }
};

module.exports = loginAdmin;
