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
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationCode } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user || user.verificationCode !== verificationCode || user.verificationCodeExpiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }
        res.status(200).json({ message: 'Code verified', email: user.email });
    }
    catch (error) {
        res.status(500).send('Error verifying code');
    }
});
module.exports = verifyCode;
