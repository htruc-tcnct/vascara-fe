import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function RegisterForm({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleRegister,
  t,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setErrorMessage(t("login.password_mismatch")); // Dùng t() nếu có bản dịch
    } else {
      setErrorMessage("");
      handleRegister();
    }
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
        placeholder="Vd: abc@ex.com"
      />

      <label>{t("login.name_user")}</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Vd: Nguyễn Văn A"
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

      <button onClick={handleSubmit} className="form-button">
        {t("login.sign_up")}
      </button>
    </div>
  );
}

export default React.memo(RegisterForm);
