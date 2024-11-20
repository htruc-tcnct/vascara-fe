import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useTranslation } from "react-i18next";
function ChangePasswordComponent() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [successUpdate, setsuccessUpdate] = useState("");

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const { t } = useTranslation();
  const userId = localStorage.getItem("idUser");
  const token = localStorage.getItem("token");
  const toggleCurrentPasswordVisibility = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const passwordCriteria =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,}$/;

  const validateCurrentPassword = () => {
    setCurrentPasswordError(
      currentPassword ? "" : "Mật khẩu hiện tại không được để trống."
    );
  };

  const validateNewPassword = () => {
    if (!newPassword) {
      setNewPasswordError("Mật khẩu mới không được để trống.");
    } else if (!passwordCriteria.test(newPassword)) {
      setNewPasswordError(
        "Mật khẩu phải bao gồm ký tự hoa, ký tự thường, số và ký tự đặc biệt."
      );
    } else {
      setNewPasswordError("");
    }
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Check if all validations pass to enable the submit button
  useEffect(() => {
    if (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      !currentPasswordError &&
      !newPasswordError &&
      !confirmPasswordError
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
  ]);

  const handleSubmit = async () => {
    if (isButtonEnabled) {
      try {
        const result = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/users/update-password`,
          {
            userId,
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Password update successful:", result.data);
        setsuccessUpdate("Updated password successfully");
      } catch (error) {
        console.error(
          "Error updating password:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          color: "#000",
          textAlign: "center",
        }}
      >
        {t("profile.change-pass")}
      </h2>
      <div style={{ position: "relative" }}>
        <label
          style={{
            fontSize: "14px",
            color: "#333",
            display: "block",
          }}
        >
          {t("profile.current-pass")}
        </label>
        <input
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onBlur={validateCurrentPassword}
          style={{
            width: "100%",
            fontSize: "13px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={toggleCurrentPasswordVisibility}
          style={{
            position: "absolute",
            right: "13px",
            top: "35px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
        </button>
        {currentPasswordError && (
          <span
            style={{
              fontSize: "12px",
              color: "#d9534f",
              marginTop: "-10px",
              display: "block",
            }}
          >
            {currentPasswordError}
          </span>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <label
          style={{
            fontSize: "14px",
            color: "#333",
            display: "block",
          }}
        >
          {t("profile.new-pass")}
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={validateNewPassword}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "13px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={toggleNewPasswordVisibility}
          style={{
            position: "absolute",
            right: "15px",
            top: "35px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
        </button>
        {newPasswordError && (
          <span
            style={{
              fontSize: "12px",
              color: "#d9534f",
              marginTop: "-10px",
              display: "block",
            }}
          >
            {newPasswordError}
          </span>
        )}
      </div>
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <label
          style={{
            fontSize: "14px",
            color: "#333",
            display: "block",
          }}
        >
          {t("profile.new-pass-again")}
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={validateConfirmPassword}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "13px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={toggleConfirmPasswordVisibility}
          style={{
            position: "absolute",
            right: "15px",
            top: "35px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
        </button>
        {confirmPasswordError && (
          <span
            style={{
              fontSize: "12px",
              color: "#d9534f",
              marginTop: "-10px",
              display: "block",
            }}
          >
            {confirmPasswordError}
          </span>
        )}
      </div>
      {successUpdate && (
        <span
          style={{
            fontSize: "12px",
            color: "#green",
            marginTop: "-10px",
            display: "block",
          }}
        >
          {successUpdate}
        </span>
      )}
      <button
        style={{
          padding: "10px",
          width: "100%",
          backgroundColor: isButtonEnabled ? "#121212" : "#ccc",
          color: "#fff",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: isButtonEnabled ? "pointer" : "not-allowed",
        }}
        onClick={handleSubmit}
        disabled={!isButtonEnabled}
      >
        {t("profile.update")}
      </button>
    </div>
  );
}

export default ChangePasswordComponent;
