import express from "express";

const router = express.Router();

const InitiatePaymentController = require("../../controllers/paystack/initiate");
const TransferController = require("../../controllers/paystack/transfer");

router.post("/initiate-payment",InitiatePaymentController);
router.post("/transfer-payment", TransferController);


module.exports = router;