"use strict";
// import GenerateSecretKey from './GenerateSecretKey';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';
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
// // Load .env variables initially
// console.log("Loading .env variables...");
// dotenv.config();
// const envPath = path.resolve(process.cwd(), '.env');
// let secretKey = process.env.JWT_SECRET_KEY;
// console.log(`Initial secretKey: ${secretKey}`);
// if (!secretKey) {
//   secretKey = GenerateSecretKey();
//   console.log("Generated Secret Key:", secretKey);
//   // Check if the .env file exists and is accessible
//   if (!fs.existsSync(envPath)) {
//     // If .env file doesn't exist, create it
//     try {
//       fs.writeFileSync(envPath, `JWT_SECRET_KEY=${secretKey}\n`);
//       console.log(`.env file created with JWT_SECRET_KEY at root: ${envPath}`);
//     } catch (error) {
//       console.error("Error creating .env file:", error);
//     }
//   } else {
//     // Append to existing .env if key is not already set
//     try {
//       const envFileContent = fs.readFileSync(envPath, 'utf-8');
//       if (!envFileContent.includes('JWT_SECRET_KEY=')) {
//         fs.appendFileSync(envPath, `JWT_SECRET_KEY=${secretKey}\n`);
//         console.log(`JWT_SECRET_KEY added to existing .env at root: ${envPath}`);
//       } else {
//         console.log("JWT_SECRET_KEY already exists in .env file.");
//       }
//     } catch (error) {
//       console.error("Error updating .env file:", error);
//     }
//   }
// } else {
//   console.log("JWT_SECRET_KEY is already set in environment variables.");
// }
// // Refresh dotenv to pick up the new secret key (if it was written)
// dotenv.config();
// console.log("JWT_SECRET_KEY from dotenv:", process.env.JWT_SECRET_KEY);
const GenerateSecretKey_1 = __importDefault(require("./GenerateSecretKey"));
const ioredis_1 = __importDefault(require("ioredis"));
// Initialize Redis client
const redis = new ioredis_1.default(); // Default: localhost:6379
const SECRET_KEY_REDIS_KEY = 'jwt_secret_key';
function getSecretKey() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let secretKey = yield redis.get(SECRET_KEY_REDIS_KEY);
            if (!secretKey) {
                secretKey = (0, GenerateSecretKey_1.default)();
                console.log("Generated Secret Key:", secretKey);
                // Store in Redis with no expiration (persist until restarted or manually deleted)
                yield redis.set(SECRET_KEY_REDIS_KEY, secretKey);
                console.log("Stored JWT secret key in Redis");
            }
            else {
                console.log("JWT secret key retrieved from Redis");
            }
            return secretKey;
        }
        catch (error) {
            console.error("Error handling secret key in Redis:", error);
            throw error;
        }
    });
}
// Example: Fetch and use the secret key
getSecretKey().then(secretKey => {
    console.log("Final Secret Key:", secretKey);
});
exports.default = getSecretKey;
