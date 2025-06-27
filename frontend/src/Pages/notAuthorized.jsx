import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-[90%]"
      >
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.2 }}
          className="text-red-600 text-6xl mb-4"
        >
          🚫
        </motion.div>

        <h1 className="text-3xl font-bold text-red-700 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to view this page. You might be lost... or just naughty. 
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition duration-300"
        >
          Go Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotAuthorized;
