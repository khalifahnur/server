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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User = require('../../../models/user');
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phoneNumber } = req.body;
        console.log("Received request body:", req.body);
        if (!name || !email || !password || !phoneNumber) {
            console.log("Missing required field:", {
                name,
                email,
                password,
                phoneNumber,
            });
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        });
        yield newUser.save();
        res.status(200).json({ message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
        console.log("Error occurred during signup:", error);
    }
});
module.exports = signUpUser;
