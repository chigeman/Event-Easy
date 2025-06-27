import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './Components/navBar';  
import HomePage from "./Pages/HomePage";
import Classify_SU from './Pages/Classify_SU';
import Login_org from './Pages/Login_org'; 
import Login_att from './Pages/Login_att'; 
import EmailVerify from './Pages/EmailVerify';
import Attendee from './Pages/Attendee';
import Organizer from './Pages/Organizer';
import Admin from './Pages/Admin';
import UserManagement from './Pages/userManagement';
import EventManagement from './Pages/eventManagement';
import EventDetail from './Pages/eventDetail';
import AttendeeEventPage from './Pages/attendEvent';
import Sidebar from './Pages/Sidebar';
import ProtectedRoute from './Pages/protectedRoute';
import NotAuthorized from './Pages/notAuthorized';
import Sett_Org from './Pages/setting_org';
import Sett_att from './Pages/setting_att';
import ViewProfile from './Pages/viewProfile';
import ReviewDisplay from './Pages/reviewDisplay';
import './index.css'; 

export default function App() {
  const [theme, setTheme] = useState("retro");

  // Load saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  // Save theme when it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // List of DaisyUI themes
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro",
    "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
    "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter", "dim", "nord", "sunset"
  ];

  return (
    <div data-theme="garden" className="min-h-screen bg-base-100 text-base-content">

      {/* Navbar */}
      {/* <div className="mb-5">
        <NavBar />
      </div> */}

      {/* Theme switcher */}
      <div className="flex justify-end px-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-sm">Theme:</span>
          <select
            className="select select-bordered select-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Classify" element={<Classify_SU />} />
        <Route path="/Login_Organizer" element={<Login_org />} />
        <Route path="/Login_Attendee" element={<Login_att />} />
        <Route path="/email-verify" element={<EmailVerify />} />

        <Route path="/Attendee" element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <Sidebar />
            <Attendee />
          </ProtectedRoute>
        } />

        <Route path="/Organizer_Dashboard" element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <Sidebar />
            <Organizer />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/event-management" element={<EventManagement />} />

        <Route path="/events/:eventId" element={
          <ProtectedRoute allowedRoles={['organizer', 'attendee']}>
            <Sidebar />
            <EventDetail />
          </ProtectedRoute>
        } />

        <Route path="/attend/:id" element={
          <ProtectedRoute allowedRoles={['organizer', 'attendee']}>
            <Sidebar />
            <AttendeeEventPage />
          </ProtectedRoute>
        } />

        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/setting" element={<Sett_Org />} />
        <Route path="/setting_att" element={<Sett_att />} />

        <Route path="/view-profile" element={
          <ProtectedRoute allowedRoles={['organizer', 'attendee']}>
            <Sidebar />
            <ViewProfile />
          </ProtectedRoute>
        } />

        <Route path="/my-reviews" element={
          <ProtectedRoute allowedRoles={['organizer', 'attendee']}>
            <Sidebar />
            <ReviewDisplay />
          </ProtectedRoute>
        } />

      </Routes>
    </div>
  );
}
