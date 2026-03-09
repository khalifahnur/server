"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecretKey_1 = __importDefault(require("../lib/getSecretKey"));
const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.admin_auth;
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded?.adminId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const secretKey = await (0, getSecretKey_1.default)(decoded?.adminId);
        const verified = jsonwebtoken_1.default.verify(token, secretKey);
        req.adminId = { id: verified.adminId };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
module.exports = authenticateAdmin;
//# sourceMappingURL=adminMiddleware.js.map