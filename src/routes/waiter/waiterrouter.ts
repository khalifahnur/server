import express from 'express';

const router = express.Router();

const waiterSignUp = require("../../controllers/auth/waiter/signup");
const waiterSignIn = require("../../controllers/auth/waiter/signin");
const waiterPassword = require("../../controllers/auth/waiter/waiterPassword");
const attachRestaurantId = require("../../middleware/attachRestaurantId");

router.post('/waiter-app-signup',attachRestaurantId, waiterSignUp);
router.post('/waiter-app-signin', waiterSignIn);
router.post('/waiter-new-password',waiterPassword);

module.exports = router;
