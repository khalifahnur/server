"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSecretKey_1 = __importDefault(require("../../../lib/getSecretKey"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendSigninEmail = require("../../../services/waitersignin");
const Waiter = require("../../../models/waiter");
const hashPassword_1 = require("../../../lib/hashPassword");
const loginWaiter = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const waiter = await Waiter.findOne({ email });
        if (!waiter) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const isPasswordMatch = (0, hashPassword_1.verifyPassword)(waiter.password, password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const secretKey = await (0, getSecretKey_1.default)(waiter._id.toString());
        const token = jsonwebtoken_1.default.sign({ userId: waiter._id }, secretKey, {
            expiresIn: "24h",
        });
        await sendSigninEmail(email);
        return res.status(200).json({
            token,
            waiter: {
                restaurantId: waiter.restaurantId,
                firstname: waiter.firstname,
                lastname: waiter.lastname,
                phoneNumber: waiter.phoneNumber,
                email: waiter.email,
            },
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error occurred during login" });
    }
};
module.exports = loginWaiter;
//# sourceMappingURL=signin.js.map