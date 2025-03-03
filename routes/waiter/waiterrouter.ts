import express from 'express';

const router = express.Router();

const waiterSignUp = require("../../controllers/auth/waiter/signup");
const waiterSignIn = require("../../controllers/auth/waiter/signin");
const waiterPassword = require("../../controllers/auth/waiter/waiterPassword");

router.post('/waiter-app-signup',waiterSignUp);
router.post('/waiter-app-signin', waiterSignIn);
router.post('/waiter-new-password',waiterPassword);

module.exports = router;
