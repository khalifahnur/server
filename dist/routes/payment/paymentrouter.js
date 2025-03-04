"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const InitiatePaymentController = require("../../controllers/paystack/initiate");
const TransferController = require("../../controllers/paystack/transfer");
router.post("/initiate-payment", InitiatePaymentController);
router.post("/transfer-payment", TransferController);
module.exports = router;
