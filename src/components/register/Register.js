import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./register.css";

function Register() {
  const [activeTab, setActiveTab] = useState("login");
  const changeToRegister = () => {
    setActiveTab("register");
  };
  const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="login-form">
        <h3 className="form-title">Đăng nhập</h3>

        <label htmlFor="email">Số điện thoại hoặc Email:</label>
        <input type="text" id="email" placeholder="Vd: 0123456789" />

        <label htmlFor="password">Mật khẩu</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
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
          Bạn quên mật khẩu?
        </a>
        <button className="form-button">Đăng nhập</button>

        <hr />
        <span className="signup-prompt">
          Bạn chưa có tài khoản? <a onClick={changeToRegister}>Đăng ký ngay</a>
        </span>
      </div>
    );
  };

  const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="register-form">
        <h3 className="form-title">Đăng ký</h3>
        <p className="form-subtitle">
          Trở thành thành viên Vascara để nhận ưu đãi độc quyền và thanh toán
          nhanh hơn
        </p>

        <label>Số điện thoại</label>
        <input type="text" placeholder="Vd: 0123456789" />

        <label>Họ và tên</label>
        <input type="text" placeholder="Vd: Nguyễn Văn A" />

        <label>Mật khẩu</label>
        <div className="password-field">
          <input
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

        <div className="terms">
          <div className="d-flex align-items-center gap-2">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree" className="m-0">
              Tôi đồng ý với các mục và chính sách dưới đây
            </label>
          </div>
          <p>
            <a href="#">Điều khoản & Điều kiện</a> và{" "}
            <a href="#">Chính sách Quyền riêng tư</a>
          </p>
        </div>
        <button className="form-button">Đăng ký</button>
      </div>
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-navbar">
        <button
          className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Đăng nhập
        </button>
        <button
          className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Đăng ký
        </button>
      </div>

      <div className="auth-content">
        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

export default Register;
