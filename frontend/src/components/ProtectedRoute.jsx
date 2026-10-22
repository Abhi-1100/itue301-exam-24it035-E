// src/components/ProtectedRoute.jsx - Route protection wrapper component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// WHY: Higher-order wrapper component that checks for an active session token
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // WHY: If user has no valid session, replace current history entry and redirect to login page "/"
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated; render protected page component
  return children;
};

export default ProtectedRoute;
