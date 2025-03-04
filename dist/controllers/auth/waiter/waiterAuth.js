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
Object.defineProperty(exports, "__esModule", { value: true });
const waiterModel = require("../../../models/waiter");
const waiterAuthentication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, validationcode } = req.body;
        if (!email || !validationcode) {
            return res.status(400).json({ message: 'Email and Verification Code are required!' });
        }
        const waiterData = yield waiterModel.findOne({ email });
        if (!waiterData) {
            return res.status(404).json({ message: "Waiter not found" });
        }
        const verify = waiterData.validationcode === validationcode;
        if (!verify) {
            return res.status(401).json({ message: "Verification code is incorrect or expired!" });
        }
        return res.status(200).json({ message: "Successfully signed up", waiterData });
    }
    catch (error) {
        console.error("Error in waiterAuthentication:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = waiterAuthentication;
