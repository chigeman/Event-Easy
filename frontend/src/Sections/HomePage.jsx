import React, { useEffect, useState } from 'react';
import { Button } from '../Constants/ui/button';
import { motion } from 'framer-motion';
import { features } from '../Constants/features';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check if dark mode was previously saved in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark'); // Apply dark mode class
    } else {
      document.documentElement.classList.remove('dark'); // Ensure light mode
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    // Save dark mode preference in localStorage
    localStorage.setItem('darkMode', newMode);
  };
  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuGPzxj_kAWZz5QCVc8TJOvVRSCf9c_mJEeg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Kfs1p6R8KPrpO1nQmJ4neF80qdBqRVZm9Q&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYV9WU4F6jxWe-Ndx3bLUNPxiU8F76Pn6HYQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsgWk3ANxBq7UPUzh9F__wphNfsAGOwCtwZA&s",
  ];

  const [bgImage, setBgImage] = useState(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setBgImage(randomImage);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, [images]);


  return (
    <div className="font-sans text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section
        className=" py-24 px-4 text-center text-white dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-900 transition-all duration-300"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.h1
          className="text-6xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Simplify Your Events. Maximize Your Impact.
        </motion.h1>
        <p className="text-2xl mb-8 max-w-3xl mx-auto">
          Event-Easy helps you plan, manage, and execute events with ease—so you can focus on what matters most.
        </p>
        <Button className="bg-white text-blue-600 hover:bg-gray-200 text-lg px-8 py-3 rounded-full shadow-lg">
          Get Started
        </Button>
        <div className="mt-12">
          
        </div>
      </section>

      {/* Toggle Dark Mode */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-3 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition-all duration-300"
      >
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900 text-center dark:text-white transition-all duration-300">
      <h2 className="text-4xl font-bold mb-12 text-indigo-600 dark:text-indigo-400">
        Core Features
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-left shadow-lg hover:shadow-md transition-shadow"
          >
            <div className="text-gray-800 dark:text-white flex items-center justify-start">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 mt-2 text-indigo-700 dark:text-indigo-300">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 text-center text-gray-800 dark:text-gray-100">
  <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-8 drop-shadow-md">
    Why Choose Event-Easy?
  </h2>
  <p className="max-w-3xl mx-auto text-lg md:text-xl mb-12 text-gray-700 dark:text-gray-200">
    Say goodbye to chaotic event planning. Event-Easy transforms the entire event journey — from promotion to post-event analysis — into a seamless, smart, and stress-free experience.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
    
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Smarter Event Promotion</h3>
      <p>Move beyond flyers and random social media posts. With Event-Easy, promote your event across multiple channels, track engagement, and reach the right audience with targeted campaigns.</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Effortless Event Discovery</h3>
      <p>Attendees can easily discover your event through intelligent search, personalized recommendations, and robust filtering—no more digging through forums or scrolling endlessly.</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Hassle-Free Registration & Ticketing</h3>
      <p>Say farewell to phone calls and paper tickets. Event-Easy supports digital registrations, secure e-ticketing, and multiple payment options for smooth and modern event access.</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Real-Time Communication</h3>
      <p>No more last-minute surprises or missed updates. With push notifications, SMS, and instant alerts, your attendees stay informed and engaged at every step.</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:col-span-2">
      <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Smart Attendee Management</h3>
      <p>Check-ins made easy with QR codes and digital badges. Track attendance, manage capacity, and gain post-event insights—all in one place, with zero paperwork.</p>
    </div>

  </div>
</section>


      {/* Screenshot / Demo */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 text-center dark:text-gray-100">
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-10">See It in Action</h2>
        <img
          src="https://images.unsplash.com/photo-1604882733123-68b3690c4900"
          alt="Dashboard Demo"
          className="mx-auto rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 w-full max-w-5xl"
        />
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-indigo-100 dark:bg-indigo-900 text-center dark:text-gray-100">
        <h2 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-10">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto">
          <p className="italic text-xl">"Event-Easy changed how we manage our university events. It's intuitive, fast, and reliable!" – A Happy Organizer</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-8 text-left dark:text-gray-100">
          <div>
            <h3 className="font-semibold text-xl text-indigo-700 dark:text-indigo-400">Is Event-Easy free to use?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Yes! We offer a free version with essential features. Premium plans unlock even more power.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-indigo-700 dark:text-indigo-400">Can I invite other organizers?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Absolutely. You can collaborate in real-time with multi-user access features.
            </p>
          </div>
        </div>
      </section>

      {/* Contact / Newsletter */}
      <section className="py-20 px-6 bg-indigo-700 text-white text-center dark:bg-indigo-800">
        <h2 className="text-3xl font-bold mb-6">Stay in the Loop</h2>
        <p className="mb-6 text-lg">Subscribe to our newsletter and never miss an update.</p>
        <form className="flex flex-col md:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded text-black dark:text-white w-72"
          />
          <Button className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-2 rounded shadow-md">
            Subscribe
          </Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white text-center dark:bg-gray-800">
        <div className="mb-6">
          <a href="#" className="mx-4 hover:underline">Home</a>
          <a href="#" className="mx-4 hover:underline">Features</a>
          <a href="#" className="mx-4 hover:underline">Contact</a>
        </div>
        <div className="mb-4 space-x-4 text-xl">
          <span>🌐</span>
          <span>📘</span>
          <span>🐦</span>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Event-Easy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
