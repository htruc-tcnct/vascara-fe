import React, { useState, useCallback } from "react";
import "./register.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { jwtDecode } from "jwt-decode";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");
  const { t } = useTranslation();
  const {errorMessage, setErrorMessage} = useState("")
  const changeToRegister = () => {
    setActiveTab("register");
  };

  const handleLogin = useCallback(async () => {
    try {
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/login`,
        {
          email,
          password,
        }
      );
      console.log("Response received: ", response); // Log the entire response
      console.log("Response data: ", response.data); // Log the response data

      const { token, idUser } = response.data;
      login(token);
      localStorage.setItem("idUser", idUser);
      const decodedToken = jwtDecode(token);

      const userRole = decodedToken.role;
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin"); // Xóa URL sau khi dùng
          navigate(redirectUrl); // Điều hướng về URL trước đó
        } else {
          navigate("/");
        }
      }
      window.location.reload();
    } catch (error) {
      console.error("Login error: ", error.response.data.message); // Log the error
      setError("Invalid email or password");
    }
  }, [email, password, login, navigate]);

  const handleRegister = useCallback(async () => {
    if (!email || !password) {
      setError("Please provide an email and password.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/register`,
        {
          email,
          password,
          name,
        }
      );
      const { token } = response.data;
      login(token);
      alert("Register successful!");
      navigate("/login-success");
    } catch (error) {
      // Check if error response exists and contains a message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message); // Display the server's error message
      } else {
        setError("Registration failed. Please try again."); // Fallback error message
      }
      console.error("Registration failed:", error.response || error);
      alert("Register failed!");
    }
  }, [email, password, name, login, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-navbar">
        <button
          className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          {t("login.sign_in")}
        </button>
        <button
          className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          {t("login.sign_up")}
        </button>
      </div>

      <div className="auth-content">
        {activeTab === "login" ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            error={error}

            t={t}
          />
        ) : (
          <RegisterForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            handleRegister={handleRegister}
            t={t}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

export default Register;
