import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay vì useHistory
import "../style/forgotten_password.css";

function ResetPassword() {
  const { id, token } = useParams(); // Lấy id và token từ URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/reset-password/${id}/${token}`,
        {
          password,
        }
      );

      setStatusMessage("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000); // Điều hướng đến trang login sau 2 giây
    } catch (error) {
      console.error("Failed to reset password:", error);
      setStatusMessage("Failed to reset password. Invalid or expired token.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleResetPassword} className="reset-button">
        Reset Password
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default ResetPassword;
