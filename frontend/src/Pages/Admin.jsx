import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [attendees, setAttendees] = useState(0);
  const [organizers, setOrganizers] = useState(0);
  const [eventStats, setEventStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchEventData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Event-Easy/users/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const users = response.data;

      const attendeeCount = users.filter(user => user.role === "attendee").length;
      const organizerCount = users.filter(user => user.role === "organizer").length;

      setAttendees(attendeeCount);
      setOrganizers(organizerCount);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const fetchEventData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Event-Easy/Event/events");
      const events = res.data;

      const total = events.length;
      const approved = events.filter(e => e.status === "approved").length;
      const pending = events.filter(e => e.status === "pending").length;
      const rejected = events.filter(e => e.status === "rejected").length;

      setEventStats({ total, approved, pending, rejected });
    } catch (error) {
      console.error("Error fetching event data:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        ⚙️ System Admin Dashboard
      </h1>

      {/* User Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700">👤 Attendees</h2>
          <p className="text-3xl font-bold text-blue-600">{attendees}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700">📣 Organizers</h2>
          <p className="text-3xl font-bold text-green-600">{organizers}</p>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-sm text-gray-600 mb-1">📊 Total Events</h3>
          <p className="text-2xl font-bold text-purple-600">{eventStats.total}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-sm text-gray-600 mb-1">✅ Approved</h3>
          <p className="text-2xl font-bold text-green-600">{eventStats.approved}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-sm text-gray-600 mb-1">🕒 Pending</h3>
          <p className="text-2xl font-bold text-yellow-500">{eventStats.pending}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-sm text-gray-600 mb-1">❌ Rejected</h3>
          <p className="text-2xl font-bold text-red-600">{eventStats.rejected}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={() => navigate("/admin/user-management")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          🛠️ Manage Users
        </button>
        <button
          onClick={() => navigate("/admin/event-management")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          📅 Manage Events
        </button>
      </div>
    </div>
  );
};

export default Admin;
