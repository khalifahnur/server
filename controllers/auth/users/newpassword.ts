import {Request,Response} from 'express'
const User = require('../../../models/user');

const bcrypt = require('bcrypt');

const resetPassword =  async (req:Request, res:Response) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear verification code and expirtion
    user.verificationCode = null;
    user.verificationCodeExpiration = null;

    await user.save();

    res.status(200).json({message:'Password updated successfully'});

  } catch (error) {
    res.status(500).send('Error updating password');
  }
};

module.exports = resetPassword
