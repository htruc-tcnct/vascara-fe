import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Forgotten_Password from "./Forgotten_Password"; // Import Forgotten_Password component
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap
import "../style/forgotten_password.css";
function LoginForm({ email, setEmail, password, setPassword, handleLogin, t }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="login-form">
      <h3 className="form-title">{t("login.sign_in")}</h3>

      <label htmlFor="email">{t("login.phone_or_email")}</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        id="email"
        placeholder="Vd: abc@ex.com"
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

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openModal();
        }}
        className="forgot-password"
      >
        {t("login.forgot_password")}
      </a>
      <button onClick={handleLogin} className="form-button">
        {t("login.sign_in")}
      </button>

      {/* React Bootstrap Modal */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset your password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Forgotten_Password />{" "}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default React.memo(LoginForm);
