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
// Initialize Mobile Money Payment
const initiatepayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, amount, email } = req.body;
    try {
        const response = yield axios_1.default.post('https://api.paystack.co/charge', {
            email,
            amount: amount * 100,
            currency: 'KES',
            mobile_money: {
                phone,
                provider: 'mpesa',
            },
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error initiating payment:', error.response.data);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});
// // Webhook to Handle Payment Confirmation
// app.post('/webhook', (req, res) => {
//   const event = req.body;
//   if (event.event === 'charge.success') {
//     console.log('Payment successful:', event.data);
//     // Add logic to initiate transfer to restaurant
//   }
//   res.sendStatus(200);
// });
module.exports = initiatepayment;
