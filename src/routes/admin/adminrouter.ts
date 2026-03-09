import express from 'express';

const router = express.Router();


const AdminSignup = require('../../controllers/auth/admin/signup');
const AdminSignin = require('../../controllers/auth/admin/signin');
const FetchInfo = require("../../controllers/auth/admin/fetchinfo");
const FetchWaiter = require("../../controllers/auth/admin/fetchWaiter");
const DeleteWaiter = require("../../controllers/auth/admin/delete");
const authenticateAdmin = require("../../middleware/adminMiddleware");
const LogoutAdmin = require("../../controllers/auth/admin/logout");



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
router.get("/fetchinfo", authenticateAdmin,FetchInfo);
router.get("/fetch-waiter",authenticateAdmin,FetchWaiter);
router.delete("/waiter/:id",authenticateAdmin,DeleteWaiter)
router.post("/logout",authenticateAdmin,LogoutAdmin);

module.exports = router;
