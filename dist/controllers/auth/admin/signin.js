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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecretKey_1 = __importDefault(require("../../../lib/getSecretKey"));
const sendSigninEmail = require("../../../services/email");
const AdminAuth = require("../../../models/admin");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield AdminAuth.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }
        const secretKey = yield (0, getSecretKey_1.default)(admin._id.toString());
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
        yield sendSigninEmail(email);
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
});
module.exports = loginAdmin;
