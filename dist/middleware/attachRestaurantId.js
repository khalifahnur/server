"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecretKey_1 = __importDefault(require("../lib/getSecretKey"));
const Admin = require("../models/admin");
const attachRestaurantId = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access token is required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded?.userId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const secretKey = await (0, getSecretKey_1.default)(decoded?.userId);
        const verified = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = verified.userId;
        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        req.restaurantId = admin.restaurantId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.module = attachRestaurantId;
//# sourceMappingURL=attachRestaurantId.js.map