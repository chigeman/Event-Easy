import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentOption() {
  const navigate = useNavigate();

  const handleChapaPayment = () => {
    const eventId = window.location.pathname.split('/')[2]; // Extract ID from current URL
    navigate(`/attend/${eventId}/PaymentOption/chapa`);
  };

  const handlePayPalPayment = () => {
    // Add PayPal navigation if needed
  };

  const handleCreditCardPayment = () => {
    // Add credit card navigation if needed
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Select Payment Method</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        {/* PayPal Button */}
        <button 
          onClick={handlePayPalPayment}
          className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 px-6 py-3 rounded-lg transition-all duration-200"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
            alt="PayPal" 
            className="h-6 mr-3" 
          />
          PayPal
        </button>

        {/* Credit Card Button */}
        <button 
          onClick={handleCreditCardPayment}
          className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-all duration-200"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
            alt="Visa" 
            className="h-5 mr-2" 
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
            alt="Mastercard" 
            className="h-5 mr-3" 
          />
          Credit Card
        </button>

        {/* Chapa Button */}
        <button
          onClick={handleChapaPayment}
          className="flex items-center justify-center bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg transition-all duration-200"
        >
          <img 
            src="https://ibsintelligence.com/wp-content/uploads/2023/07/1614589194625.jpg" 
            alt="Chapa" 
            className="h-6 mr-3" 
          />
          Pay with Chapa
        </button>
      </div>
    </div>
  );
}

export default PaymentOption;