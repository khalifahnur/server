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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecretKey_1 = __importDefault(require("../../../lib/getSecretKey"));
const oauthSignin = (providerName) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user.email) {
                return res.redirect("http://localhost:3000/login?error=email_not_available");
            }
            const secretKey = yield (0, getSecretKey_1.default)(user._id.toString());
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, secretKey, {
                expiresIn: "24h",
            });
            const isProduction = process.env.NODE_ENV === "production";
            const frontendURL = isProduction
                ? "https://swiftab-web.vercel.app/dash"
                : "http://127.0.0.1:3000/dash";
            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.redirect(frontendURL);
        }
        catch (err) {
            console.error(`${providerName} auth error:`, err);
            res.redirect("http://localhost:3000/login?error=auth_failed");
        }
    });
};
module.exports = oauthSignin;
