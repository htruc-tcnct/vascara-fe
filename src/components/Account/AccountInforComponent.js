import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles.css";
import axios from "axios";

function AccountInfoComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [activeLink, setActiveLink] = useState(""); // Track active link
  const UserId = localStorage.getItem("idUser");
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const handleLinkClick = (path) => {
    setActiveLink(path); // Update active link
    setShowIntro(false);
    navigate(path);
  };
  useEffect(() => {
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
        setName(result.data.user.name);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    getUserInfo();
  }, [UserId, token]);
  const handleLogout = () => {
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem("token");
    localStorage.removeItem("cartCount");
    window.location.reload();
  };
  return (
    <Container style={{ color: "#25282B" }} className="my-2">
      <Row>
        <Col md={12} className="ms-5">
          <div className="breadcrumb responsive-text">
            <a href="/" style={{ color: "#555", textDecoration: "none" }}>
              {t("new_arrivals")}{" "}
            </a>
            <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <a
              href="/account-info"
              style={{ color: "#555", textDecoration: "none" }}
            >
              {t("profile.profile")}{" "}
            </a>
          </div>
        </Col>
      </Row>
      <Container>
        <Card className="p-1 border-0">
          <h6 style={{ fontSize: "24px" }} className="responsive-text">
            {t("profile.hello")}, {name ? name : t("profile.guest")}
          </h6>
        </Card>

        <Row>
          <Col md={3}>
            <ListGroup variant="flush" className="mt-4">
              <ListGroup.Item className="responsive-text">
                <strong>{t("profile.my-profile")}</strong>
              </ListGroup.Item>

              <ListGroup.Item className="responsive-text">
                <a
                  href="#"
                  onClick={() => handleLinkClick("purchase-history")}
                  style={{
                    color: "#000",
                    textDecoration:
                      activeLink === "purchase-history" ? "underline" : "none",
                  }}
                >
                  {t("profile.history-ordered")}
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ float: "right" }}
                />
              </ListGroup.Item>

              <ListGroup.Item className="responsive-text">
                <a
                  href="#"
                  onClick={() => handleLinkClick("edit-profile")}
                  style={{
                    color: "#000",
                    textDecoration:
                      activeLink === "edit-profile" ? "underline" : "none",
                  }}
                >
                  {t("profile.my-infor")}
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ float: "right" }}
                />
              </ListGroup.Item>

              <ListGroup.Item className="responsive-text">
                <a
                  href="#"
                  onClick={() => handleLinkClick("address")}
                  style={{
                    color: "#000",
                    textDecoration:
                      activeLink === "address" ? "underline" : "none",
                  }}
                >
                  {t("profile.my-address")}
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ float: "right" }}
                />
              </ListGroup.Item>

              <ListGroup.Item className="responsive-text">
                <a
                  href="#"
                  onClick={() => handleLinkClick("change-password")}
                  style={{
                    color: "#000",
                    textDecoration:
                      activeLink === "change-password" ? "underline" : "none",
                  }}
                >
                  {t("profile.change-pass")}
                </a>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ float: "right" }}
                />
              </ListGroup.Item>

              <ListGroup.Item className="responsive-text">
                <a
                  href="#"
                  onClick={handleLogout}
                  style={{
                    color: "red",
                    textDecoration:
                      activeLink === "logout" ? "underline" : "none",
                  }}
                >
                  {t("profile.logout")}
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={9}>
            {showIntro ? (
              <Card className="border-0">
                <Card.Body>
                  <h6 className="responsive-text">{t("profile.slogan")}</h6>
                  <p className="responsive-text">{t("profile.introduce")}</p>
                  <img
                    src="https://res.cloudinary.com/dite5ojuq/image/upload/v1731418629/at8clnzdtqhawrljprya.jpg"
                    alt="Banner"
                    className="img-fluid"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Card.Body>
              </Card>
            ) : (
              <Outlet /> // Render selected nested route
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default AccountInfoComponent;
