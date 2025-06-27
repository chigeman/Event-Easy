import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaStar,
  FaTicketAlt,
  FaCommentDots,
  FaMoneyBillWave,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { AppContent } from '../context/AppContext'; // Make sure this has userData and setUserData

const Sidebar = () => {
  const { userData, setUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const role = userData?.role || 'attendee';
  const [isOpen, setIsOpen] = useState(true);

  // 🧠 REAL LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/Event-Easy/users/logout', {
        method: 'POST',
        credentials: 'include', // 👈 Required to send the cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        localStorage.removeItem('token');
        setUserData(null);
        navigate('/'); // Redirect to login or landing page
      } else {
        const data = await res.json();
        alert('Logout failed: ' + data.message);
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Server error during logout.');
    }
  };

  const getSidebarItemsByRole = () => {
    const commonItems = [
      { icon: <FaBell />, title: 'Notifications', path: '/notifications' },
      { icon: <FaUserCircle />, title: 'Profile', path: '/view-profile' },
      { icon: <FaSignOutAlt />, title: 'Logout', path: '/logout', action: handleLogout },
    ];

    if (role === 'organizer') {
      return [
        { icon: <FaUserCircle />, title: 'Profile', path: '/view-profile' },
        { icon: <FaCalendarAlt />, title: 'Manage Events', path: '/manage-events' },
        { icon: <FaTicketAlt />, title: 'Ticket Sales', path: '/ticket-sales' },
        { icon: <FaMoneyBillWave />, title: 'Payments', path: '/payments' },
        ...commonItems,
      ];
    } else {
      return [
        { icon: <FaCalendarAlt />, title: 'Browse Events', path: '/Attendee' },
        { icon: <FaStar />, title: 'My Interests', path: '/my-interests' },
        { icon: <FaTicketAlt />, title: 'My Tickets', path: '/my-tickets' },
        { icon: <FaCommentDots />, title: 'My Reviews', path: '/my-reviews' },
        { icon: <FaMoneyBillWave />, title: 'Payment History', path: '/payment-history' },
        ...commonItems,
      ];
    }
  };

  const sidebarItems = getSidebarItemsByRole();

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const sidebarVariants = {
    open: {
      width: 280,
      backgroundColor: '#fff',
      boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      width: 64,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const linkVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.15 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed top-0 left-0 h-full z-50 flex flex-col bg-white shadow-lg"
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-300">
        {isOpen && (
          <h1 className="text-2xl font-extrabold tracking-wide text-indigo-700 select-none">
            EventEasy
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-md hover:bg-indigo-100 text-indigo-600 transition-colors duration-300"
        >
          {isOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 mt-8 space-y-3 overflow-y-auto px-3">
        {sidebarItems.map(({ icon, title, path, action }, index) => (
          <li
            key={index}
            onClick={() => {
              if (title === 'Logout' && typeof action === 'function') {
                action(); 
              }
            }}
          >
            {/* Disable Link for Logout */}
            {title !== 'Logout' ? (
              <Link to={path}>
                <motion.div
                  variants={linkVariants}
                  animate={isOpen ? 'open' : 'closed'}
                  className="flex items-center gap-5 px-4 py-3 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors duration-300 select-none"
                >
                  <span className="text-2xl text-indigo-600">{icon}</span>
                  {isOpen && (
                    <span className="font-semibold text-gray-800 text-lg">
                      {title}
                    </span>
                  )}
                </motion.div>
              </Link>
            ) : (
              <motion.div
                variants={linkVariants}
                animate={isOpen ? 'open' : 'closed'}
                className="flex items-center gap-5 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-100 text-red-500 transition-colors duration-300 select-none"
              >
                <span className="text-2xl">{icon}</span>
                {isOpen && (
                  <span className="font-semibold text-lg">Logout</span>
                )}
              </motion.div>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-300 text-center text-sm text-gray-400 select-none">
        {isOpen && '© 2025 EventEasy'}
      </div>
    </motion.nav>
  );
};

export default Sidebar;
