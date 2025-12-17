import express from "express";

const router = express.Router();

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
