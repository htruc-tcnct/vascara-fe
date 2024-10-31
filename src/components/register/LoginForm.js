import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function LoginForm({ email, setEmail, password, setPassword, handleLogin, t }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="login-form">
      <h3 className="form-title">{t("login.sign_in")}</h3>

      <label htmlFor="email">{t("login.phone_or_email")}</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        id="email"
        placeholder="Vd: 0123456789"
      />

      <label htmlFor="password">{t("login.password")}</label>
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="eye-icon"
          onClick={togglePasswordVisibility}
          style={{ cursor: "pointer" }}
        />
      </div>

      <a href="#" className="forgot-password">
        {t("login.forgot_password")}
      </a>
      <button onClick={handleLogin} className="form-button">
        {t("login.sign_in")}
      </button>
    </div>
  );
}

export default React.memo(LoginForm);
