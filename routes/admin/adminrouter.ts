import express from 'express';
import passport from '../../controllers/auth/passport/passport'

const router = express.Router();


const AdminSignup = require('../../controllers/auth/admin/signup');
const AdminSignin = require('../../controllers/auth/admin/signin');
const FetchInfo = require("../../controllers/auth/admin/fetchinfo");
const authenticateUser = require("../../middleware/middleware");
const LogoutAdmin = require("../../controllers/auth/admin/logout");
const { oauthSignin } = require("../../controllers/auth/admin/oauth");


// const AuthController = require("../controllers/AuthController");
// const forgotPsswdController = require("../controllers/ForgotPsswdController");
// const verifyCodeController = require("../controllers/VerifyCodeController");
// const resetPasswordController = require("../controllers/NewPassword")

router.post("/SignUp", AdminSignup);
router.post("/SignIn", AdminSignin);
// router.post("/:userId/updateRestaurantDetails", AuthController.updateRestaurantDetails);
// router.post("/forgot-password",forgotPsswdController.forgotPsswd);
// router.post("/verify-code",verifyCodeController.verifyCode);
// router.post("/reset-password",resetPasswordController.resetPassword);
router.get("/fetchinfo", authenticateUser,FetchInfo);
router.post("/logout",authenticateUser,LogoutAdmin);

router.get("/google-auth", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google-auth/callback", passport.authenticate("google", { failureRedirect: "/login?error=auth_failed" }), oauthSignin("Google"));

router.get("/x-auth", passport.authenticate("twitter"));
router.get("/x-auth/callback", passport.authenticate("twitter", { failureRedirect: "/login?error=auth_failed" }), oauthSignin("X"));

module.exports = router;
