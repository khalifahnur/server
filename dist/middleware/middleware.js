"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateSecretKey_1 = __importDefault(require("../lib/GenerateSecretKey"));
const secretKey = process.env.JWT_SECRET_KEY || (0, GenerateSecretKey_1.default)();
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access token is required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
module.exports = authenticateUser;
