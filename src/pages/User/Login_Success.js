// src/pages/Login_Success.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login_Success() {
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context để xóa token và cập nhật trạng thái đăng nhập
    navigate("/"); // Điều hướng về trang chủ hoặc trang đăng nhập
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login Successful!</h1>
      <p style={styles.message}>Welcome to the application.</p>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "2rem",
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login_Success;
