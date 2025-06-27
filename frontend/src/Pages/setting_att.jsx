import React, { useState } from 'react';
import { motion } from 'framer-motion';

const eventHistory = [
  { id: 1, name: '🔥 Afro Beats Night', date: '2025-05-25', status: 'Attended' },
  { id: 2, name: '🚀 Tech Expo Addis', date: '2025-04-20', status: 'Registered' },
  { id: 3, name: '🎭 Drama Festival', date: '2025-03-10', status: 'Missed' },
];

const AttendeeSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Miki Attendee',
    email: 'attendee@example.com',
    phone: '+251 900 123 456',
    bio: 'Event explorer and music festival addict 🎶✨',
    profilePic: 'https://i.pravatar.cc/150?img=3',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const logoutAllDevices = () => {
    alert('🛑 Logged out from all devices!');
  };

  const getStatusColor = (status) => {
    return status === 'Attended'
      ? 'text-green-600 dark:text-green-400'
      : status === 'Registered'
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors`}>
      <motion.div className="max-w-5xl mx-auto p-8 sm:p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">
            🎟️ Attendee Settings
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500 text-white shadow-xl"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <motion.div className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 dark:border-gray-700/60">
          {/* Profile Info */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              👤 Profile Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-8">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-28 h-28 rounded-full shadow-md border-4 border-white/60 dark:border-gray-700 object-cover"
              />
              <div className="space-y-4 w-full max-w-md">
                {['name', 'email', 'phone'].map((field) => (
                  <label key={field} className="block">
                    <span className="text-indigo-700 dark:text-indigo-300 font-semibold capitalize">
                      {field}
                    </span>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={profile[field]}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-lg bg-white/70 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 px-4 py-2 transition"
                    />
                  </label>
                ))}
                <label>
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Bio / Interests</span>
                  <textarea
                    name="bio"
                    rows="3"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    className="mt-1 w-full rounded-lg bg-white/70 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 px-4 py-2 transition resize-none"
                    placeholder="Tell us something fun about you!"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              🔔 Notifications
            </h2>
            <div className="space-y-4 max-w-md">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleNotificationChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium capitalize">
                    {key} Notifications
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Event History */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              📅 Event History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/60 dark:bg-gray-700/70 rounded-lg">
                <thead className="bg-indigo-600 dark:bg-indigo-500 text-white">
                  <tr>
                    <th className="text-left px-6 py-3">Event</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eventHistory.map((event) => (
                    <tr
                      key={event.id}
                      className="odd:bg-white/40 even:bg-indigo-100 dark:odd:bg-gray-700/40 dark:even:bg-gray-800/40"
                    >
                      <td className="px-6 py-4">{event.name}</td>
                      <td className="px-6 py-4">{event.date}</td>
                      <td className={`px-6 py-4 font-semibold ${getStatusColor(event.status)}`}>
                        {event.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section className="mb-12 max-w-md">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              🔐 Security
            </h2>
            <form className="space-y-6">
              {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
                <label key={field} className="block">
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <input
                    type="password"
                    name={field}
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-lg bg-white/70 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 px-4 py-2 transition"
                    placeholder="••••••••"
                  />
                </label>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-lg shadow-lg transition"
              >
                Change Password
              </motion.button>
            </form>
          </section>

          {/* Logout All */}
          <section className="max-w-md">
            <motion.button
              onClick={logoutAllDevices}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition"
            >
              🚪 Logout from All Devices
            </motion.button>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AttendeeSettings;
