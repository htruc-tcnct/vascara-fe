import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking auth
  }

  return isAuthenticated ? children : <Navigate to="/register" />;
};

export default ProtectedRoute;
