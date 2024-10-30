// src/authContext/AuthContext.js

import React, { createContext, useContext, useState } from "react";

// Tạo context
const AuthContext = createContext();

// Provider để bao bọc ứng dụng, cung cấp hàm `login`, `logout` và `isAuthenticated`
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (newToken) => {
    localStorage.setItem("token", newToken); // Lưu token vào localStorage
    setToken(newToken); // Cập nhật trạng thái token trong state
  };

  const logout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    setToken(null); // Xóa token khỏi state
  };

  const isAuthenticated = !!token; // true nếu có token, ngược lại false

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
