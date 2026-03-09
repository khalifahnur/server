"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const generateSecretKey_1 = __importDefault(require("./generateSecretKey"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const redis = new Redis('redis://localhost:6379');
const redis = new ioredis_1.default(process.env.REDIS_URL);
const getSecretKey = async (userId) => {
    const SECRET_KEY_REDIS_KEY = `user:${userId}:jwt_secret`;
    let secretKey = await redis.get(SECRET_KEY_REDIS_KEY);
    if (!secretKey) {
        secretKey = (0, generateSecretKey_1.default)();
        await redis.set(SECRET_KEY_REDIS_KEY, secretKey);
    }
    return secretKey;
};
exports.default = getSecretKey;
//# sourceMappingURL=getSecretKey.js.map