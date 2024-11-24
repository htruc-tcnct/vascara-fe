import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleQuestion,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./CheckOutComponent.css";
import { useTranslation } from "react-i18next";
import AddressFormModal from "./AddressFormModal";
import axios from "axios";
function CheckOutComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];
  const token = localStorage.getItem("token");
  const { i18n, t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [addressAdded, setAddressAdded] = useState(false);
  const [addressList, setAddressList] = useState([]); // Danh sách địa chỉ
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleCheckout = () => {
    console.log(selectedAddressId, " ");
  };
  const handleAddressSubmit = (newAddress) => {
    setAddressList((prev) => [...prev, newAddress]); // Thêm địa chỉ mới vào danh sách
    setSelectedAddressId(newAddress.id); // Đặt địa chỉ mới làm địa chỉ được chọn
    setAddressAdded(true);
    fetchAddresses();
  };
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/address/get-address",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response.data.data.address);
      setAddressList(response.data.data.address);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  useEffect(() => {
    if (currentStep === 2) {
      fetchAddresses();
    }
  }, [currentStep, showModal]);
  const handleNextStep = () => {
    setErrorMessage("");

    if (currentStep === 1 && !token) {
      setErrorMessage("Bạn cần đăng nhập để tiếp tục.");
      return;
    }

    if (currentStep === 2 && !addressAdded) {
      setErrorMessage(
        "Vui lòng thêm thông tin người nhận hàng trước khi tiếp tục."
      );
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="mb-3">
            {token ? (
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-success me-2"
                />
                <span>
                  Bạn đã đăng nhập bằng tài khoản <strong>0393976624</strong>
                </span>
              </Card.Body>
            ) : (
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FontAwesomeIcon
                    icon={faCircleQuestion}
                    className="text-warning me-2 icon-large"
                  />
                  <span>
                    <p className="text-warning mb-0">
                      Vui lòng đăng nhập để tiếp tục thanh toán
                    </p>
                  </span>
                </div>
                <Button
                  variant="outline-dark"
                  onClick={() => {
                    localStorage.setItem(
                      "redirectAfterLogin",
                      window.location.pathname
                    );
                    navigate("/register");
                  }}
                >
                  Đăng nhập ngay
                </Button>
              </Card.Body>
            )}
          </Card>
        );
      case 2:
        return (
          <Card className="mb-3">
            <Card.Header>2. Địa chỉ</Card.Header>
            <Card.Body>
              <p>Thông tin người nhận hàng</p>
              <Form>
                {addressList.map((address) => (
                  <Form.Check
                    key={address.address_id}
                    type="radio"
                    label={`${address.province_name} - ${address.district_name}, ${address.ward_name}, ${address.specific_address}`}
                    name="address"
                    value={address.address_id}
                    checked={selectedAddressId === address.address_id}
                    onChange={() => setSelectedAddressId(address.address_id)}
                  />
                ))}
              </Form>
              <Button
                variant="outline-secondary"
                className="w-100 mb-3"
                onClick={() => setShowModal(true)}
              >
                Thêm thông tin người nhận hàng{" "}
                <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
            </Card.Body>
            <AddressFormModal
              show={showModal}
              onHide={() => setShowModal(false)}
              onSubmit={handleAddressSubmit}
            />
          </Card>
        );
      case 3:
        return (
          <Card className="mb-3">
            <Card.Header>3. Thanh toán</Card.Header>
            <Card.Body>
              <p>Chọn phương thức thanh toán</p>
              {/* Tùy chỉnh phương thức thanh toán ở đây */}
            </Card.Body>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="my-4 px-5">
      {/* Thanh tiến trình */}
      <div className="progress-bar-container mb-4">
        <div className={`step ${currentStep >= 1 ? "completed" : ""}`}>
          <div className="circle">1</div>
          <span>Đăng nhập</span>
        </div>
        <div className={`line ${currentStep > 1 ? "active" : ""}`}></div>
        <div className={`step ${currentStep >= 2 ? "completed" : ""}`}>
          <div className="circle">2</div>
          <span>Địa chỉ</span>
        </div>
        <div className={`line ${currentStep > 2 ? "active" : ""}`}></div>
        <div className={`step ${currentStep >= 3 ? "completed" : ""}`}>
          <div className="circle">3</div>
          <span>Thanh toán</span>
        </div>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
        <Col md={7}>
          {/* Hiển thị nội dung từng bước */}
          {renderStepContent()}

          {/* Nút điều hướng */}
          <div className="d-flex justify-content-between mt-3">
            {currentStep === 1 ? (
              <Button variant="secondary" onClick={() => navigate("/")}>
                Trở về trang chủ
              </Button>
            ) : (
              <Button variant="secondary" onClick={handlePreviousStep}>
                Quay lại
              </Button>
            )}
            {currentStep < 3 ? (
              <Button variant="dark" onClick={handleNextStep}>
                Tiếp tục
              </Button>
            ) : (
              <Button variant="success" onClick={handleCheckout}>
                Hoàn tất thanh toán
              </Button>
            )}
          </div>
        </Col>

        {/* Tổng kết đơn hàng */}
        <Col md={5}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span>Giá trị đơn hàng</span>
                <strong>{totalPrice.toLocaleString()}đ</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Số lượng</span>
                <strong>{totalQuantity}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Tạm tính</span>
                <strong>{totalPrice.toLocaleString()}đ</strong>
              </div>
            </Card.Body>
          </Card>

          {/* Sản phẩm */}
          <Card>
            <Card.Header>
              Sản phẩm đang thanh toán ({cartItems.length})
            </Card.Header>
            <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
              {cartItems.map((item, index) => (
                <div key={index} className="mb-3">
                  <Row>
                    <Col xs={4}>
                      <img
                        src={item.mainImageUrl}
                        alt={item.translations[i18n.language]}
                        className="img-fluid rounded"
                      />
                    </Col>
                    <Col xs={8}>
                      <p className="mb-1">{item.translations[i18n.language]}</p>
                      <p className="text-muted mb-1">Size: {item.size}</p>
                      <p className="text-muted mb-1">
                        Giá: {Math.round(item.price).toLocaleString()}đ
                      </p>
                      <p className="text-muted">Số lượng: {item.quantity}</p>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckOutComponent;
