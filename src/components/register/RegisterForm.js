import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

function RegisterForm({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleRegister,
  t,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const criteria = [
    { id: "lowercase", text: "At least one lowercase letter", regex: /[a-z]/ },
    { id: "uppercase", text: "At least one uppercase letter", regex: /[A-Z]/ },
    { id: "number", text: "At least one number", regex: /\d/ },
    {
      id: "special",
      text: "At least one special character",
      regex: /[@$!%*?&]/,
    },
    { id: "length", text: "At least 8 characters", regex: /^.{8,}$/ },
  ];

  const getCriterionStatus = (criterion) => criterion.regex.test(password);

  const allCriteriaMet = criteria.every((criterion) =>
    getCriterionStatus(criterion)
  );

  const handleSubmit = () => {
    if (!allCriteriaMet) {
      setErrorMessage(t("login.password_requirements"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("login.password_mismatch")); // Use translations if available
      return;
    }

    setErrorMessage("");
    handleRegister();
  };

  return (
    <div className="register-form">
      <h3 className="form-title">{t("login.sign_up")}</h3>
      <p className="form-subtitle">{t("login.slogan")}</p>

      <label>{t("login.phone_or_email")}</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="e.g., abc@ex.com"
      />

      <label>{t("login.name_user")}</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="e.g., John Doe"
      />

      <label>{t("login.password")}</label>
      <div className="password-field">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="********"
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="eye-icon"
          onClick={togglePasswordVisibility}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Password Criteria Display */}
      <div className="password-criteria d-flex">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className={`criterion ${
              getCriterionStatus(criterion) ? "met" : ""
            }`}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{
                marginRight: "5px",
                color: getCriterionStatus(criterion) ? "green" : "lightgray",
              }}
            />
            <span
              style={{
                color: getCriterionStatus(criterion) ? "green" : "lightgray",
              }}
            >
              {criterion.text}
            </span>
          </div>
        ))}
      </div>

      <label>{t("login.confirm_password")}</label>
      <div className="password-field">
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="********"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {error && (
        <div className="error-message text-center text-danger">{error}</div>
      )}

      {/* Disabled Register Button if Criteria Not Met */}
      <button
        onClick={handleSubmit}
        className="form-button"
        disabled={!allCriteriaMet}
        style={{
          backgroundColor: allCriteriaMet ? "" : "#ccc",
          cursor: allCriteriaMet ? "pointer" : "not-allowed",
        }}
      >
        {t("login.sign_up")}
      </button>
    </div>
  );
}

export default React.memo(RegisterForm);
