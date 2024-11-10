import React, { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Container,
  Row,
  Col,
  Nav,
  Dropdown,
  Offcanvas,
  Accordion,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMagnifyingGlass,
  faBell,
  faUser,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./style/header.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LanguageSelector from "../middleware/changeLanguge";
import { useCart } from "../context/CartContext";
import CartModal from "../components/CartModal/CartModal";
import { getUserIdFromToken } from "../utils/auth";
function OffCanvasExample({ show, handleClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/register");
    handleClose();
  };
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Vascara</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Accordion hiển thị bên trong Offcanvas */}
        <Accordion defaultActiveKey="0">
          {/* Mục 1 */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>{t("menu.bags")}</Accordion.Header>
            <Accordion.Body>
              <ul style={{ paddingLeft: "20px" }}>
                <li>
                  <Nav.Link href="#view_all_bags">
                    {t("menu.view_all_bags")}
                  </Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#large_bags">{t("menu.large_bags")}</Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#medium_bags">
                    {t("menu.medium_bags")}
                  </Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#small_bags">{t("menu.small_bags")}</Nav.Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Mục 2 */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>{t("menu.shoes")}</Accordion.Header>
            <Accordion.Body>
              <ul style={{ paddingLeft: "20px" }}>
                <li>
                  <Nav.Link href="#view_all_shoes">
                    {t("menu.view_all_shoes")}
                  </Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#high_heels">{t("menu.high_heels")}</Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#sandal">{t("menu.sandal")}</Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#sneaker">{t("menu.sneaker")}</Nav.Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Mục 3 */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>{t("menu.accessories")}</Accordion.Header>
            <Accordion.Body>
              <ul style={{ paddingLeft: "20px" }}>
                <li>
                  <Nav.Link href="#gift_card">{t("menu.gift_card")}</Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#glasses">{t("menu.glasses")}</Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#belts">{t("menu.belts")}</Nav.Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Mục 4 */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>{t("menu.sale")}</Accordion.Header>
            <Accordion.Body>
              <ul style={{ paddingLeft: "20px" }}>
                <li>
                  <Nav.Link href="#online_exclusive">
                    {t("menu.online_exclusive")}
                  </Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#bag_sale">{t("menu.bag_sale")}</Nav.Link>
                </li>
                <li>
                  <Nav.Link href="#shoes_sale">{t("menu.shoes_sale")}</Nav.Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          {/* Mục 5 */}
          <Button
            variant="variant"
            size="lg"
            style={{
              display: "block",
              margin: "20px auto",
              padding: "10px 20px",
              backgroundColor: "#d9534f",
              border: "none",
              borderRadius: "25px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onClick={goToLogin}
          >
            {t("menu.account")}{" "}
            {/* Tùy chỉnh nhãn của nút dựa trên yêu cầu của bạn */}
          </Button>
        </Accordion>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function Header({ scrollDirection }) {
  const { cartCount } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showToogle, setToogle] = useState(false);
  const timeoutRef = useRef(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(null);
  const [userId, setUserId] = useState(null); // State to store userId
  const [token, setToken] = useState(null);
  useEffect(() => {
    const idFromToken = getUserIdFromToken();
    setUserId(idFromToken);
  }, []);
  useEffect(() => {
    // Kiểm tra token trong localStorage khi component mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8081/users/login", {
        email,
        password,
      });

      const { token, idUser } = response.data;
      localStorage.setItem("idUser", idUser);
      login(token); // Cập nhật trạng thái đăng nhập và lưu token qua AuthContext

      alert("Login successful!");
      navigate("/"); // Chuyển hướng ngay lập tức
      window.location.reload();
    } catch (error) {
      setError("Invalid email or password"); // Thông báo lỗi nếu đăng nhập thất bại
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseEnter = (type) => {
    setShowModal(type); // Hiển thị modal
  };
  const handleLogout = () => {
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem("token");
    localStorage.removeItem("cartCount");
    setToken(null);
    window.location.reload();
  };
  const handleMouseLeave = () => {
    setShowModal(null); // Ẩn modal khi rời chuột
  };

  useEffect(() => {}, [showModal]);
  const handleToogle = () => setToogle(!showToogle);
  const handleClose = () => setToogle(false);
  return (
    <header
      className={`header-position ${
        scrollDirection === "down" ? "hide" : "show"
      }`}
    >
      <Navbar
        expand="lg"
        bg="white"
        variant="light"
        style={{ width: "100% !important" }}
      >
        <Container fluid className="d-flex ">
          <Navbar.Toggle
            style={{ border: "0", fontSize: "15px" }}
            onClick={handleToogle}
          />
          <OffCanvasExample show={showToogle} handleClose={handleClose} />
          <Navbar.Collapse className="d-lg-flex d-none">
            <Row className="w-100">
              <Col xs={3} className="d-flex align-items-center">
                <div className="d-flex flex-column align-items-center">
                  <img
                    src="https://www.vascara.com/uploads/web/900/Logo/vascara.png"
                    alt=""
                    style={{ width: "100px" }}
                  />
                  <LanguageSelector />
                </div>
              </Col>
              <Col xs={6} className="d-flex justify-content-center">
                <Nav className="d-none d-lg-flex flex-nowrap">
                  {/* hang moi */}
                  <Nav.Link className="px-3" href="/">
                    {t("new_arrivals")}
                  </Nav.Link>
                  {/* San Pham với OffCanvas */}
                  <Nav.Link
                    className="px-3"
                    href="#new_arrivals"
                    onMouseEnter={() => handleMouseEnter("products")}
                  >
                    {t("products")}
                  </Nav.Link>

                  {
                    <Dropdown.Menu
                      className="custom-menu"
                      style={{
                        width: "96vw",
                        padding: "20px",
                        background: "#fff",
                        border: "1px solid #ddd",
                        position: "absolute",
                        left: 0,
                        top: "100%",
                      }}
                      show={showModal === "products"}
                      onMouseEnter={() => handleMouseEnter("products")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Row>
                        <Col>
                          <Dropdown.Item className="text-decoration-none fs-5">
                            {t("menu.bags")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/bag?filter=all"
                          >
                            {t("menu.view_all_bags")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/bag?filter=L"
                          >
                            {t("menu.large_bags")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/bag?filter=M"
                          >
                            {t("menu.medium_bags")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/bag?filter=S"
                          >
                            {t("menu.small_bags")}
                          </Dropdown.Item>
                        </Col>
                        <Col>
                          <Dropdown.Item className="text-decoration-none fs-5">
                            {t("menu.shoes")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/sandal?category_id=3&filter=all"
                          >
                            {t("menu.view_all_shoes")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/sandal?category_id=3&filter=high_heels"
                          >
                            {t("menu.high_heels")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/sandal?category_id=3&filter=sandal"
                          >
                            {t("menu.sandal")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/sandal?category_id=3&filter=sneaker"
                          >
                            {t("menu.sneaker")}
                          </Dropdown.Item>
                        </Col>
                        <Col>
                          <Dropdown.Item className="text-decoration-none fs-5">
                            {t("menu.wallets")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/wallet?category_id=2&filter=all"
                          >
                            {t("menu.all-wall")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/wallet?category_id=2&filter=hand"
                          >
                            {t("menu.hand_wallet")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/wallet?category_id=2&filter=mini"
                          >
                            {t("menu.mini_wallet")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="/wallet?category_id=2&filter=leather"
                          >
                            {t("menu.real_leather_wallet")}
                          </Dropdown.Item>
                        </Col>
                        <Col>
                          <Dropdown.Item className="text-decoration-none fs-5">
                            {t("menu.accessories")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="#phu_kien_1"
                          >
                            {t("menu.gift_card")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="#phu_kien_2"
                          >
                            {t("menu.glasses")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="#phu_kien_3"
                          >
                            {t("menu.belts")}
                          </Dropdown.Item>
                        </Col>
                        <Col>
                          <Dropdown.Item className="text-decoration-none fs-5">
                            {t("menu.sale")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="#sale_1"
                          >
                            {t("menu.online_exclusive")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="#sale_2"
                          >
                            {t("menu.bag_sale")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="custom-dropdown-item"
                            href="#sale_3"
                          >
                            {t("menu.shoes_sale")}
                          </Dropdown.Item>
                        </Col>
                        <Col>
                          <img
                            style={{ width: "200px", height: "300px" }}
                            src="https://www.vascara.com/uploads/web/900/Banner-Ver-4-0/thang-10-2024/464x608-2.jpg"
                          />
                        </Col>
                      </Row>
                    </Dropdown.Menu>
                  }
                  {/* bo suu tap */}
                  <Nav.Link className="px-3" href="#collections">
                    {t("collections")}
                  </Nav.Link>
                  {/* fashion talks */}

                  <Nav.Link className="px-3" href="#fashion_talks">
                    {t("fashion_talks")}
                  </Nav.Link>
                  <Nav.Link className="px-3" href="#notifications">
                    {t("notifications")}
                  </Nav.Link>
                  <Nav.Link className="px-3" href="#store">
                    {t("store")}
                  </Nav.Link>
                </Nav>
              </Col>
              <Col xs={3} className="d-flex justify-content-end">
                <Navbar className="m-2">
                  <FontAwesomeIcon
                    className="icon-pointer"
                    icon={faMagnifyingGlass}
                  />
                </Navbar>
                <Navbar
                  onMouseEnter={() => handleMouseEnter("inform")}
                  onMouseLeave={handleMouseLeave}
                  className="m-2"
                >
                  <FontAwesomeIcon className="icon-pointer" icon={faBell} />
                </Navbar>
                <Navbar
                  onMouseEnter={() => handleMouseEnter("user")}
                  onMouseLeave={handleMouseLeave}
                  className="m-2"
                >
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic" as="div">
                      <FontAwesomeIcon className="icon-pointer" icon={faUser} />{" "}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu">
                      {token ? (
                        // Hiển thị menu người dùng nếu có token
                        <div className="user-menu">
                          <Dropdown.Item href="/account-info">
                            Thông tin tài khoản
                          </Dropdown.Item>
                          <Dropdown.Item href="/order-history">
                            Lịch sử mua hàng
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleLogout}>
                            Đăng xuất
                          </Dropdown.Item>
                        </div>
                      ) : (
                        // Hiển thị form đăng nhập nếu chưa có token
                        <div className="login-form">
                          <h3 className="login-title">Đăng nhập</h3>

                          <label htmlFor="email">
                            Số điện thoại hoặc email
                          </label>
                          <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Vd: 0123456789"
                          />

                          <label htmlFor="password">Mật khẩu</label>
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

                          {error && (
                            <p
                              className="error-message"
                              style={{ fontSize: "12px", color: "red" }}
                            >
                              {error}
                            </p>
                          )}

                          <button
                            className="login-button"
                            onClick={handleLogin}
                          >
                            Đăng nhập
                          </button>

                          <hr />
                          <span className="signup-prompt">
                            Bạn chưa có tài khoản?{" "}
                            <a href="/register">Đăng ký</a>
                          </span>
                        </div>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Navbar>
                <Navbar
                  onMouseEnter={() => handleMouseEnter("cart")}
                  onMouseLeave={handleMouseLeave}
                  className="ms-2"
                >
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      className="icon-pointer"
                      icon={faBagShopping}
                    />
                    {cartCount >= 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          backgroundColor: "#5C5C5C",
                          color: "white",
                          borderRadius: "50%",
                          padding: "1px 4px",
                          fontSize: "10px",
                        }}
                      >
                        {cartCount}
                      </span>
                    )}{" "}
                    <CartModal
                      show={showModal === "cart"}
                      userId={userId}
                      cartCount={cartCount}
                    />
                  </div>
                </Navbar>
              </Col>
            </Row>
          </Navbar.Collapse>
          <Navbar className="d-lg-none ">
            <img
              src="https://www.vascara.com/uploads/web/900/Logo/vascara.png"
              alt=""
              style={{ width: "80px" }}
            />
          </Navbar>
          <div className="d-lg-none d-flex">
            <LanguageSelector />

            <Navbar className="ms-2">
              <div style={{ position: "relative" }}>
                <FontAwesomeIcon
                  className="icon-pointer"
                  icon={faBagShopping}
                />
                {cartCount >= 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-7px",
                      right: "-8px",
                      backgroundColor: "#5C5C5C",
                      color: "white",
                      borderRadius: "50%",
                      padding: "1px 4px",
                      fontSize: "7px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </Navbar>
            <Navbar className="ms-2">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Navbar>
          </div>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
