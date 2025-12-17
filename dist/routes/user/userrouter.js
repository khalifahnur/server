"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const UserSignup = require("../../controllers/auth/users/signup");
const UserSignin = require("../../controllers/auth/users/signin");
const forgotPsswdController = require("../../controllers/auth/users/forgotpassword");
const verifyCodeController = require("../../controllers/auth/users/verifycode");
const resetPasswordController = require("../../controllers/auth/users/newpassword");
router.post("/SignUp", UserSignup);
router.post("/SignIn", UserSignin);
router.post("/forgot-password", forgotPsswdController);
router.post("/verify-code", verifyCodeController);
router.post("/reset-password", resetPasswordController);
module.exports = router;
//# sourceMappingURL=userrouter.js.map