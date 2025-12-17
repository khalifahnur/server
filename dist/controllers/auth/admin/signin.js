"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecretKey_1 = __importDefault(require("../../../lib/getSecretKey"));
const hashPassword_1 = require("../../../lib/hashPassword");
const sendSigninEmail = require("../../../services/email");
const AdminAuth = require("../../../models/admin");
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminAuth.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const isPasswordMatch = (0, hashPassword_1.verifyPassword)(admin.password, password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const secretKey = await (0, getSecretKey_1.default)(admin._id.toString());
        const token = jsonwebtoken_1.default.sign({ userId: admin._id }, secretKey, {
            expiresIn: "24h",
        });
        console.log("token form singin", token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'lax' for local
            //sameSite: 'none',
            //domain: 'server-production-2ee7.up.railway.app',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,
        });
        // Send email
        await sendSigninEmail(email);
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                userId: admin._id,
                name: admin.name,
                email: admin.email,
                phoneNumber: admin.phoneNumber,
                restaurantId: admin.restaurantId || null,
            },
        });
    }
    catch (error) {
        console.error("Error occurred during login:", error);
        const errorMessage = error instanceof Error
            ? error.message
            : "Unexpected error occurred during login";
        res.status(500).json({
            message: errorMessage,
            details: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
};
module.exports = loginAdmin;
//# sourceMappingURL=signin.js.map