import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
function EditProfileComponent() {
  const [userInfo, setUserInfo] = useState({});
  const [phoneError, setPhoneError] = useState("");
  const UserId = localStorage.getItem("idUser");
  const token = localStorage.getItem("token");
  const { updateInfor } = useCart();
  const { t } = useTranslation();

  // Fetch all provinces initially

  // Fetch user info and set initial state
  const getUserInfo = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/id/${UserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = result.data.user;
      setUserInfo(userData);

      const addressFull = userData.address?.[0];
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Handle phone number changes
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setUserInfo({ ...userInfo, phonenumber: value });

    if (!validatePhoneNumber(value)) {
      setPhoneError(t("profile.invalid-phone"));
    } else {
      setPhoneError("");
    }
  };

  // Update user information
  const updateInfo = async () => {
    if (phoneError || !validatePhoneNumber(userInfo.phonenumber)) {
      setPhoneError(t("profile.invalid-phone"));
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/update/${UserId}`,
        {
          ...userInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateInfor(true, false);
    } catch (error) {
      console.error("Error updating user info:", error);
      updateInfor(false, true);
    }
  };

  return (
    <Container fluid className="my-4 responsive-text">
      <h4>{t("profile.personal-info")}</h4>
      <Form style={{ position: "relative" }}>
        <Form.Group className="mb-3 responsive-text" controlId="formName">
          <Form.Label>{t("profile.full-name")}</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Nguyễn Hữu Trực"
            value={userInfo.name || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formPhone">
          <Form.Label>{t("profile.phone-number")}</Form.Label>
          <Form.Control
            type="text"
            name="phonenumber"
            placeholder="0393976624"
            value={userInfo.phonenumber || ""}
            onChange={handlePhoneChange}
            className={phoneError ? "error-border" : ""}
          />
          {phoneError && <div className="text-danger mt-1">{phoneError}</div>}
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="VD: abs@gmail.com"
            value={userInfo.email || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formDob">
          <Form.Label>{t("profile.birth")}</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            placeholder="Chọn ngày sinh"
            value={userInfo.birthday || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button
          variant="dark"
          className="responsive-text"
          style={{ width: "30%" }}
          onClick={(e) => {
            e.preventDefault();
            updateInfo();
          }}
        >
          {t("profile.update")}
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfileComponent;
