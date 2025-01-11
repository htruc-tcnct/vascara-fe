import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth(); // Assume `user` is provided by AuthContext

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" />; // Redirect to register if not authenticated
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log(user?.role);
    console.log(requiredRole);
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page if role doesn't match
  }

  return children; // Render the protected component if all checks pass
};

export default ProtectedRoute;
