"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const waiterSignUp = require("../../controllers/auth/waiter/signup");
const waiterSignIn = require("../../controllers/auth/waiter/signin");
const waiterPassword = require("../../controllers/auth/waiter/waiterPassword");
router.post('/waiter-app-signup', waiterSignUp);
router.post('/waiter-app-signin', waiterSignIn);
router.post('/waiter-new-password', waiterPassword);
module.exports = router;
