import axios from 'axios';
import {Response,Request} from 'express'
require('dotenv').config();


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize Mobile Money Payment
const initiatepayment = async (req:Request, res:Response) => {
  const { phone, amount, email } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/charge',
      {
        email,
        amount: amount * 100,
        currency: 'KES',
        mobile_money: {
          phone,
          provider: 'mpesa',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error:any) {
    console.error('Error initiating payment:', error.response.data);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
}

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

