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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateSecretKeyWaiter_1 = __importDefault(require("../../../lib/GenerateSecretKeyWaiter"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendSigninEmail = require('../../../services/waitersignin');
const Waiter = require('../../../models/waiter');
const secretKey = process.env.JWT_SECRET_KEY_WAITER || (0, GenerateSecretKeyWaiter_1.default)();
const loginWaiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const waiter = yield Waiter.findOne({ email });
        if (!waiter) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, waiter.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const token = jsonwebtoken_1.default.sign({ waiterId: waiter._id }, secretKey, {
            expiresIn: "24h",
        });
        // Send email
        yield sendSigninEmail(email);
        return res.status(200).json({
            token,
            waiter: {
                restaurantId: waiter.restaurantId,
                firstname: waiter.firstname,
                lastname: waiter.lastname,
                phoneNumber: waiter.phoneNumber,
                email: waiter.email
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error occurred during login" });
        console.log("Error occurred during login:", error);
    }
});
module.exports = loginWaiter;
