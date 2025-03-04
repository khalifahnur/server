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
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const transferpayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paybillNumber, amount, restaurantName, phoneNumber } = req.body;
    try {
        const response = yield axios_1.default.post('https://api.paystack.co/transfer', {
            source: 'balance',
            amount: amount * 100,
            currency: 'KES',
            recipient: {
                type: 'mobile_money',
                name: restaurantName,
                account_number: paybillNumber,
                bank_code: 'MPESA',
                phone: phoneNumber,
            },
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error initiating transfer:', error.response.data);
        res.status(500).json({ error: 'Failed to transfer funds' });
    }
});
module.exports = transferpayment;
