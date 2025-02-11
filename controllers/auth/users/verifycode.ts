import { Request, Response } from 'express';

const User = require('../../../models/user');


const verifyCode = async (req:Request, res:Response) => {
    const { email, verificationCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || user.verificationCode !== verificationCode || user.verificationCodeExpiration < Date.now()) {
        return res.status(400).json({message:'Invalid or expired verification code'});
      }
  
      res.status(200).json({message:'Code verified',email: user.email});
    } catch (error) {
      res.status(500).send('Error verifying code');
    }
  };

module.exports = verifyCode;
  