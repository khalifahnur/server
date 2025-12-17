"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const generateSecretKey = () => {
    return (0, crypto_1.randomBytes)(32).toString("hex");
};
exports.default = generateSecretKey;
//# sourceMappingURL=GenerateSecretKey.js.map