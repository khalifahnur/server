"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const GenerateSecretKey_1 = __importDefault(require("./GenerateSecretKey"));
const redis = new ioredis_1.default();
const newSecretKey = async (userId) => {
    const SECRET_KEY_REDIS_KEY = `user:${userId}:jwt_secret`;
    let secretKey = (0, GenerateSecretKey_1.default)();
    await redis.set(SECRET_KEY_REDIS_KEY, secretKey);
    return secretKey;
};
exports.default = newSecretKey;
//# sourceMappingURL=rotateSecretKey.js.map