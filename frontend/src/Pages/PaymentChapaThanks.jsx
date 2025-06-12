import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function PaymentChapaThanks() {
  const { id } = useParams();
  const location = useLocation();
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tx_ref = query.get('tx_ref');
    const attendeeInfo = JSON.parse(localStorage.getItem('attendeeInfo') || '{}');

    if (!tx_ref) {
      setMessage('No transaction reference found.');
      return;
    }

    // Optionally, get token from localStorage if needed for auth
    const token = localStorage.getItem('token');

    axios.post(
      `http://localhost:5000/Event-Easy/Event/payment/${id}/verify?tx_ref=${tx_ref}`,
      attendeeInfo,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        }
      }
    )
      .then(res => {
        setMessage('Thanks for paying! Your attendance is confirmed.');
        // Optionally clear attendee info
        localStorage.removeItem('attendeeInfo');
      })
      .catch(err => {
        setMessage('Payment verification failed: ' + (err.response?.data?.message || err.message));
      });
  }, [id, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Payment Status</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}