"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    const hashed = (0, crypto_1.scryptSync)(password, salt, 64).toString("hex");
    return `${salt}:${hashed}`;
}
function verifyPassword(storedPassword, suppliedPassword) {
    const [salt, hashedPassword] = storedPassword.split(":");
    const hashedBuffer = Buffer.from(hashedPassword, "hex");
    const suppliedBuffer = (0, crypto_1.scryptSync)(suppliedPassword, salt, 64);
    // Use timingSafeEqual to prevent timing attacks
    return (0, crypto_1.timingSafeEqual)(hashedBuffer, suppliedBuffer);
}
//# sourceMappingURL=hashPassword.js.map