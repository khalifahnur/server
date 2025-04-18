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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateSecretKey_1 = __importDefault(require("../../../lib/GenerateSecretKey"));
const secretKey = process.env.JWT_SECRET_KEY || (0, GenerateSecretKey_1.default)();
const LogoutAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".up.railway.app",
            path: '/'
        });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});
module.exports = LogoutAdmin;
