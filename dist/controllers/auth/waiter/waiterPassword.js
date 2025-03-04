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
const waiterModel = require("../../../models/waiter");
const waiterPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const updatedWaiter = yield waiterModel.findOneAndUpdate({ email }, { password: hashedPassword, validationcode: '', validationcodeExpiration: '' }, { new: true });
        if (!updatedWaiter) {
            return res.status(404).json({ message: "Waiter not found" });
        }
        return res.status(200).json({ message: "Waiter password created successfully" });
    }
    catch (error) {
        console.error("Error creating waiter password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = waiterPassword;
