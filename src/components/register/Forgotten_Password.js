import React, { useState } from "react";
import axios from "axios";
import "../style/forgotten_password.css";

function SendMessage() {
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fetchUserData = async () => {
    if (!toEmail) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/${toEmail}`
      );
      const user = response.data.user;
      if (user) {
        setToName(user.name);
        setStatusMessage("User data retrieved successfully.");
      } else {
        setToName("");
        setStatusMessage("User not found with this email.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setToName("");
      setStatusMessage("Failed to retrieve user data.");
    }
  };

  const handleSendMessage = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/request-reset-password`,
        { email: toEmail } // Dữ liệu email người dùng
      );

      setStatusMessage(
        response.data.message || "Check your email for reset instructions."
      );
      setToEmail("");
      setToName("");
    } catch (error) {
      console.error("Failed to send reset password email:", error);
      setStatusMessage("Failed to send reset password link. Please try again.");
    }
  };

  return (
    <div className="send-message-container">
      <h2>Send a Password Reset Link</h2>
      <input
        type="email"
        placeholder="Recipient's Email"
        value={toEmail}
        onChange={(e) => setToEmail(e.target.value)}
        onBlur={fetchUserData}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Recipient's Name"
        value={toName}
        onChange={(e) => setToName(e.target.value)}
        disabled
        className="input-field"
      />
      <button onClick={handleSendMessage} className="send-button">
        Send
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default SendMessage;
