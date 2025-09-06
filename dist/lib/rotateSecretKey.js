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
const ioredis_1 = __importDefault(require("ioredis"));
const GenerateSecretKey_1 = __importDefault(require("./GenerateSecretKey"));
const redis = new ioredis_1.default();
const newSecretKey = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const SECRET_KEY_REDIS_KEY = `user:${userId}:jwt_secret`;
    let secretKey = (0, GenerateSecretKey_1.default)();
    yield redis.set(SECRET_KEY_REDIS_KEY, secretKey);
    return secretKey;
});
exports.default = newSecretKey;
