"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../../../models/user');
const bcrypt = require('bcrypt');
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user)
            return res.status(404).send('User not found');
        // Hash the new password
        const hashedPassword = yield bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        // Clear verification code and expirtion
        user.verificationCode = null;
        user.verificationCodeExpiration = null;
        yield user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).send('Error updating password');
    }
});
module.exports = resetPassword;
