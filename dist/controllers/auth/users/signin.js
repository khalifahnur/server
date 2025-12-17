"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecretKey_1 = __importDefault(require("../../../lib/getSecretKey"));
const hashPassword_1 = require("../../../lib/hashPassword");
const sendSigninEmail = require("../../../services/email");
const User = require("../../../models/user");
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const isPasswordMatch = (0, hashPassword_1.verifyPassword)(user.password, password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const secretKey = await (0, getSecretKey_1.default)(user._id.toString());
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, secretKey, {
            expiresIn: "24h",
        });
        await sendSigninEmail(email);
        return res.status(200).json({
            token,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error occurred during login" });
    }
};
module.exports = loginUser;
//# sourceMappingURL=signin.js.map