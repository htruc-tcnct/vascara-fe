// src/authContext/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Nếu không đăng nhập, chuyển hướng về trang chủ
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
