import React, { useState } from 'react';
import { motion } from 'framer-motion';

const billingMockData = [
  { id: 'INV-001', date: '2025-05-01', amount: '$49.99', status: 'Paid' },
  { id: 'INV-002', date: '2025-04-01', amount: '$29.99', status: 'Paid' },
  { id: 'INV-003', date: '2025-03-01', amount: '$19.99', status: 'Failed' },
];

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Miki the Organizer',
    email: 'miki@example.com',
    phone: '+251 912 345 678',
    facebook: '',
    twitter: '',
    instagram: '',
    bio: 'Passionate about football and creating epic events.',
    profilePic: 'https://i.pravatar.cc/150?img=12',
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  // Handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const logoutAllDevices = () => {
    alert('🚪 Logging out from all devices! Stay safe, boss!');
    // Here you’d call backend API to invalidate all sessions
  };

  return (
    <div
      className={`${
        darkMode ? 'dark' : ''
      } min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto p-8 sm:p-12"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">
            ⚙️ Organizer Settings
          </h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500 text-white shadow-xl transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Glassmorphic Container */}
        <motion.div
          className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 dark:border-gray-700/60"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Profile Settings */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              👤 Profile Settings
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full shadow-lg border-4 border-white/60 dark:border-gray-700/60 object-cover"
              />
              <div className="flex-grow space-y-4 w-full max-w-md">
                <label className="block">
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                    Display Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                  />
                </label>

                <label className="block">
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                  />
                </label>

                <label className="block">
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                    Phone
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                  />
                </label>

                {/* Social Media Links */}
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                      Facebook
                    </span>
                    <input
                      type="url"
                      name="facebook"
                      placeholder="https://facebook.com/yourprofile"
                      value={profile.facebook}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                    />
                  </label>
                  <label className="block">
                    <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                      Twitter
                    </span>
                    <input
                      type="url"
                      name="twitter"
                      placeholder="https://twitter.com/yourhandle"
                      value={profile.twitter}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                    />
                  </label>
                  <label className="block">
                    <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                      Instagram
                    </span>
                    <input
                      type="url"
                      name="instagram"
                      placeholder="https://instagram.com/yourprofile"
                      value={profile.instagram}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                    Bio / Description
                  </span>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition resize-none"
                    placeholder="A little intro about you or your company..."
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Account Security */}
          <section className="mb-12 max-w-md">
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              🔒 Account Security
            </h2>
            <form className="space-y-6">
              <label className="block">
                <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                  Old Password
                </span>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                  placeholder="••••••••"
                />
              </label>
              <label className="block">
                <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                  New Password
                </span>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                  placeholder="••••••••"
                />
              </label>
              <label className="block">
                <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                  Confirm New Password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-lg bg-white/80 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition"
                  placeholder="••••••••"
                />
              </label>
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

          {/* Notification Preferences */}
          <section className="mb-12 max-w-md">
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              🔔 Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                ['Email Notifications', 'email'],
                ['SMS Notifications', 'sms'],
                ['Push Notifications', 'push'],
              ].map(([label, key]) => (
                <label
                  key={key}
                  className="flex items-center space-x-4 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={notifications[key]}
                    onChange={handleNotificationChange}
                    className="w-5 h-5 rounded border-indigo-400 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Logout All Devices */}
          <section className="mb-12 max-w-md">
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              🚪 Security Control
            </h2>
            <motion.button
              onClick={logoutAllDevices}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition"
            >
              Logout from all devices
            </motion.button>
          </section>

          {/* Billing History */}
          <section className="max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
              💳 Billing History
            </h2>
            <div className="overflow-x-auto rounded-lg border border-indigo-300 dark:border-indigo-600 shadow-inner">
              <table className="min-w-full bg-white/70 dark:bg-gray-700/70 rounded-lg">
                <thead className="bg-indigo-600 dark:bg-indigo-500 text-white">
                  <tr>
                    <th className="text-left px-6 py-3">Invoice #</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Amount</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingMockData.map(({ id, date, amount, status }) => (
                    <tr
                      key={id}
                      className="odd:bg-white/50 even:bg-indigo-50 dark:odd:bg-gray-700/50 dark:even:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 font-mono">{id}</td>
                      <td className="px-6 py-4">{date}</td>
                      <td className="px-6 py-4">{amount}</td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          status === 'Paid'
                            ? 'text-green-600 dark:text-green-400'
                            : status === 'Failed'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
