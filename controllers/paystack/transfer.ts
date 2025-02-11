import axios from 'axios';
import {Response,Request} from 'express';

require('dotenv').config();


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


const transferpayment =  async (req:Request, res:Response) => {
    const { paybillNumber, amount, restaurantName, phoneNumber } = req.body;
  
    try {
      const response = await axios.post(
        'https://api.paystack.co/transfer',
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );
  
      res.json(response.data);
    } catch (error:any) {
      console.error('Error initiating transfer:', error.response.data);
      res.status(500).json({ error: 'Failed to transfer funds' });
    }
  };

  module.exports = transferpayment;
  