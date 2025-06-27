import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext'; // Adjust path if needed

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoggedin, userData } = useContext(AppContent);

  console.log("ProtectedRoute -> User Data:", userData); // Debug line

  // If no userData yet, maybe it's still loading
  if (!userData) return <div>Loading...</div>;

  // Role not allowed? Redirect!
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // 🎉 Welcome, authorized one!
  return children;
};

export default ProtectedRoute;
