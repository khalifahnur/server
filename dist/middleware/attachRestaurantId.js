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
const ioredis_1 = __importDefault(require("ioredis"));
const Admin = require("../models/admin");
const GenerateSecretKey_1 = __importDefault(require("../lib/GenerateSecretKey"));
//const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();
// Initialize Redis client
const redis = new ioredis_1.default();
const SECRET_KEY_REDIS_KEY = "jwt_secret_key";
// Function to get the secret key from Redis (or generate if missing)
const getSecretKey = () => __awaiter(void 0, void 0, void 0, function* () {
    let secretKey = yield redis.get(SECRET_KEY_REDIS_KEY);
    if (!secretKey) {
        secretKey = (0, GenerateSecretKey_1.default)();
        yield redis.set(SECRET_KEY_REDIS_KEY, secretKey);
    }
    return secretKey;
});
const attachRestaurantId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access token is required" });
    }
    try {
        const secretKey = yield getSecretKey();
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = decoded.userId;
        // Find the admin by userId and get the restaurantId
        const admin = yield Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        req.restaurantId = admin.restaurantId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});
module.exports = attachRestaurantId;
