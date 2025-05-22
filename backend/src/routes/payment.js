const express = require('express');
const axios = require('axios');
const router = express.Router();
const Event = require('../models/eventModel');
const jwt = require('jsonwebtoken');

// Payment initiation route
router.post('/payment/:id/initiate', async (req, res) => {
  const { id } = req.params;
  const { email, amount, first_name, last_name } = req.body;

  // Generate a unique transaction reference
  const tx_ref = `event-${id}-${Date.now()}`;

  try {
    // Call Chapa API to create a payment session
    const chapaRes = await axios.post(
  'https://api.chapa.co/v1/transaction/initialize',
  {
    amount,
    currency: 'ETB',
    email,
    first_name,
    last_name,
    tx_ref,
return_url: `https://1c9a-213-55-79-195.ngrok-free.app/attend/${id}/PaymentOption/verify?tx_ref=${tx_ref}`,
callback_url: `https://1c9a-213-55-79-195.ngrok-free.app/attend/${id}/PaymentOption/verify?tx_ref=${tx_ref}`,
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);

    // Send the Chapa checkout URL to the frontend
    return res.json({ checkoutUrl: chapaRes.data.data.checkout_url });
  } catch (error) {
    console.error('Chapa error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Payment verification route (now POST)
router.post('/payment/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { tx_ref } = req.query;
  const { first_name, last_name, email } = req.body;

  try {
    // 1. Verify payment with Chapa
    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        }
      }
    );

    const status = verifyRes.data.data.status;

    if (status === 'success') {
      // 2. Get userId from token
      let userId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          userId = payload.id;
        } catch (err) {
          return res.status(401).json({ success: false, message: 'Invalid token.' });
        }
      } else {
        return res.status(401).json({ success: false, message: 'No token provided.' });
      }

      // 3. Add user to event's attendees array with details
      await Event.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            attendees: {
              userId,
              first_name,
              last_name,
              email
            }
          }
        },
        { new: true }
      );

      return res.json({ success: true, message: 'Payment verified and attendee added!' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not successful.' });
    }
  } catch (error) {
    console.error('Chapa verify error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;