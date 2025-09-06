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
const Admin = require("../models/admin");
const getSecretKey_1 = __importDefault(require("../lib/getSecretKey"));
const attachRestaurantId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access token is required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const secretKey = yield (0, getSecretKey_1.default)(decoded === null || decoded === void 0 ? void 0 : decoded.userId);
        const verified = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = verified.userId;
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
