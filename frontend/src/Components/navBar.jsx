import '../Components/navBar.css';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Search, MapPin } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-xl font-bold bg-gradient-to-r from-[#34d5eb] to-blue-800 text-transparent bg-clip-text dark:text-white transition-all duration-300">
              Event-Easy
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-4 max-w-3xl">
            <div className="flex w-full border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden shadow-sm">
              {/* Search Icon + Input */}
              <div className="flex items-center px-4 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search events"
                className="w-full py-2 px-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 outline-none"
              />

              {/* Divider */}
              <div className="w-px bg-gray-300 dark:bg-gray-600 my-2"></div>

              {/* Location Input */}
              <div className="flex items-center px-3 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                <MapPin className="w-5 h-5 mr-1" />
                <input
                  type="text"
                  placeholder="Search for city"
                  className="bg-transparent outline-none text-sm w-28 text-gray-700 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-full transition-all flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#contact-sales" className="hover:text-blue-500 dark:text-gray-300 transition-all">Contact Sales</a>
            <a href="#create" className="hover:text-blue-500 dark:text-gray-300 transition-all">Create Events</a>
            <a href="#help" className="hover:text-blue-500 dark:text-gray-300 transition-all">Help Center</a>
            <a href="#tickets" className="hover:text-blue-500 dark:text-gray-300 transition-all">Find my tickets</a>

            {/* 🌙 Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-200 transition-all duration-300">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a href="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Log In</a>
            <a href="/signup" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out">
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-800 dark:text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <a href="#contact-sales" className="block text-gray-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300">Contact Sales</a>
          <a href="#create" className="block text-gray-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300">Create Events</a>
          <a href="#help" className="block text-gray-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300">Help Center</a>
          <a href="#tickets" className="block text-gray-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300">Find my tickets</a>
          <a href="/login" className="block text-gray-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300">Log In</a>
          <a href="/signup" className="block text-gray-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300">Sign Up</a>

          {/* 🌙 Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="block text-sm text-gray-700 dark:text-gray-200">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}
