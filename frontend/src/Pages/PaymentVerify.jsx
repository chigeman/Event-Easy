import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentVerify = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let tx_ref = searchParams.get('tx_ref');
    if (!tx_ref) {
      setStatus('error');
      setMessage('No transaction reference found.');
      return;
    }

    // Get token and attendee info from localStorage
    const token = localStorage.getItem('token');
    const attendeeInfo = JSON.parse(localStorage.getItem('attendeeInfo') || '{}');

    axios.post(
      `http://localhost:5000/Event-Easy/Event/payment/${id}/verify?tx_ref=${tx_ref}`,
      attendeeInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        if (res.data.success) {
          setStatus('success');
          setMessage('Payment successful! You are now registered for the event.');
          localStorage.removeItem('attendeeInfo');
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Payment verification failed.');
        }
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Payment verification failed.');
      });
  }, [id, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        {status === 'verifying' && <p className="text-lg">Verifying payment...</p>}
        {status === 'success' && <p className="text-green-600 text-xl font-bold">{message}</p>}
        {status === 'error' && <p className="text-red-600 text-xl font-bold">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentVerify;