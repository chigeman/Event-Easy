import React from 'react'

function PaymentChappa() {
  return (
    <div>PaymentChappa
        <h1 className="text-2xl font-bold text-center mb-8">Chapa Payment</h1>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-xl font-semibold mb-4">Payment Successful!</h2>
            <p className="text-gray-700 mb-4">Thank you for your payment.</p>
            <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
            Go to Home
            </button>
        </div>
    </div>
  )
}

export default PaymentChappa