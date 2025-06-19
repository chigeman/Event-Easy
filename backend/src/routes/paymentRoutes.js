const express = require('express');
const axios = require('axios');
const router = express.Router();

// Initiate payment for an event
router.post('/event/:id/payment/initiate', async (req, res) => {
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
        return_url: `http://localhost:5173/attend/${id}/payment-verification?tx_ref=${tx_ref}`,
        callback_url: `http://localhost:5173/attend/${id}/payment-verification?tx_ref=${tx_ref}`,
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

// Verify payment for an event
router.post('/event/:id/payment/verify', async (req, res) => {
  // TODO: Implement Chapa payment verification logic here
  res.json({ message: 'Payment verification endpoint' });
});

module.exports = router;