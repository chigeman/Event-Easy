// import React, { useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const PaymentChappa = () => {
//   const { id } = useParams();
//   const [form, setForm] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     amount: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);

//     // Store attendee info for verification step
//     localStorage.setItem('attendeeInfo', JSON.stringify({
//       first_name: form.first_name,
//       last_name: form.last_name,
//       email: form.email
//     }));

//     try {
//       const res = await axios.post(
//         `http://localhost:5000/Event-Easy/Event/payment/${id}/initiate`,
//         {
//           email: form.email,
//           amount: form.amount,
//           first_name: form.first_name,
//           last_name: form.last_name
//         }
//       );
//       window.location.href = res.data.checkoutUrl;
//     } catch (err) {
//       alert('Payment initiation failed: ' + (err.response?.data?.error || err.message));
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">Complete Payment</h2>
//         <input
//           type="text"
//           name="first_name"
//           placeholder="First Name"
//           value={form.first_name}
//           onChange={handleChange}
//           required
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="text"
//           name="last_name"
//           placeholder="Last Name"
//           value={form.last_name}
//           onChange={handleChange}
//           required
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="number"
//           name="amount"
//           placeholder="Amount"
//           value={form.amount}
//           onChange={handleChange}
//           required
//           min="1"
//           className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-60"
//         >
//           {loading ? 'Processing...' : 'Pay with Chapa'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentChappa;  