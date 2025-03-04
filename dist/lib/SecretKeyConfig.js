"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateSecretKey_1 = __importDefault(require("./GenerateSecretKey"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env variables initially
console.log("Loading .env variables...");
dotenv_1.default.config();
const envPath = path_1.default.resolve(process.cwd(), '.env');
let secretKey = process.env.JWT_SECRET_KEY;
console.log(`Initial secretKey: ${secretKey}`);
if (!secretKey) {
    secretKey = (0, GenerateSecretKey_1.default)();
    console.log("Generated Secret Key:", secretKey);
    // Check if the .env file exists and is accessible
    if (!fs_1.default.existsSync(envPath)) {
        // If .env file doesn't exist, create it
        try {
            fs_1.default.writeFileSync(envPath, `JWT_SECRET_KEY=${secretKey}\n`);
            console.log(`.env file created with JWT_SECRET_KEY at root: ${envPath}`);
        }
        catch (error) {
            console.error("Error creating .env file:", error);
        }
    }
    else {
        // Append to existing .env if key is not already set
        try {
            const envFileContent = fs_1.default.readFileSync(envPath, 'utf-8');
            if (!envFileContent.includes('JWT_SECRET_KEY=')) {
                fs_1.default.appendFileSync(envPath, `JWT_SECRET_KEY=${secretKey}\n`);
                console.log(`JWT_SECRET_KEY added to existing .env at root: ${envPath}`);
            }
            else {
                console.log("JWT_SECRET_KEY already exists in .env file.");
            }
        }
        catch (error) {
            console.error("Error updating .env file:", error);
        }
    }
}
else {
    console.log("JWT_SECRET_KEY is already set in environment variables.");
}
// Refresh dotenv to pick up the new secret key (if it was written)
dotenv_1.default.config();
console.log("JWT_SECRET_KEY from dotenv:", process.env.JWT_SECRET_KEY);
