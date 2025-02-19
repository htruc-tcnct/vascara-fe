import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Image,
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
import { useCart } from "../../context/CartContext";
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
  const { confirmOrder } = useCart();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleCheckout = async () => {
    // confirmOrder(cartItems, selectedAddressId);
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/order/checkout`,
      {
        totalPrice,
        cartItemList: cartItems,
        addressId: selectedAddressId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.removeItem("checkoutCurrentStep");
    console.log("response: ", response.data);
    window.location.href = response.data.payUrl;
  };
  const handleOrdered = () => {
    confirmOrder(cartItems, selectedAddressId);
  };
  const handleAddressSubmit = (newAddress) => {
    setAddressList((prev) => [...prev, newAddress]); // Thêm địa chỉ mới vào danh sách
    setSelectedAddressId(newAddress.address_id); // Đặt địa chỉ mới làm địa chỉ được chọn
    fetchAddresses();
  };
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/address/get-address`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(">>>>>>>>>>>>>>>>>>: ", response.data.data.address);
      setAddressList(response.data.data.address);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
    const savedStep = localStorage.getItem("checkoutCurrentStep");
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10)); // Khôi phục bước từ localStorage
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

    const nextStep = Math.min(currentStep + 1, 3);
    setCurrentStep(nextStep);
    localStorage.setItem("checkoutCurrentStep", nextStep); // Lưu bước hiện tại vào localStorage
  };

  const handlePreviousStep = () => {
    setErrorMessage("");

    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    localStorage.setItem("checkoutCurrentStep", prevStep); // Lưu bước hiện tại vào localStorage
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId); // Cập nhật state
    // console.log("Selected Address ID changed to:", addressId); // Ghi log
    setAddressAdded(true);
  };
  const [selectedPayment, setSelectedPayment] = useState("");

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
    console.log("Selected Payment Method:", method);
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
                  {t("checkout.loginMessage")} <strong>0393976624</strong>
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
                    {t("checkout.loginPrompt")}
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
                  Đ{t("checkout.loginButton")}
                </Button>
              </Card.Body>
            )}
          </Card>
        );
      case 2:
        return (
          <Card className="mb-3">
            <Card.Header>2. {t("checkout.addressHeader")}</Card.Header>
            <Card.Body>
              <p>{t("checkout.addressInfo")}</p>
              <Form>
                {addressList.map((address) => (
                  <Form.Check
                    key={address.address_id}
                    type="radio"
                    label={`${address.province_name} - ${address.district_name}, ${address.ward_name}, ${address.specific_address}`}
                    name="address"
                    value={address.address_id}
                    checked={selectedAddressId === address.address_id}
                    onChange={() => handleAddressChange(address.address_id)} // Gọi hàm xử lý
                  />
                ))}
              </Form>
              <Button
                variant="outline-secondary"
                className="w-100 mb-3"
                onClick={() => setShowModal(true)}
              >
               {t("checkout.addAddressButton")}
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
            <Card.Header>3.  {t("checkout.paymentHeader")}</Card.Header>
            <Card.Body>
              <p>{t("checkout.paymentMethod")}:</p>
              <Form>
                {/* Momo */}
                <Form.Check
                  type="radio"
                  id="payment-momo"
                  name="payment-method"
                  label={
                    <div className="d-flex align-items-center">
                      <Image
                        src="https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0=w240-h480-rw"
                        alt="Momo Logo"
                        style={{
                          objectFit: "contain",
                          width: "50px",
                          height: "50px",
                        }}
                        className="me-2"
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                       {t("checkout.paymentMomo")}
                      </span>
                    </div>
                  }
                  value="Momo"
                  checked={selectedPayment === "Momo"}
                  onChange={() => handlePaymentChange("Momo")}
                />

                {/* Tiền mặt */}
                <Form.Check
                  type="radio"
                  id="payment-cash"
                  name="payment-method"
                  className="mt-5"
                  label={
                    <div className="d-flex align-items-center">
                      <Image
                        src="https://freepnglogo.com/images/all_img/1725386814cash-app-logo.png"
                        alt="Cash Icon"
                        style={{
                          objectFit: "contain",
                          width: "50px",
                          height: "50px",
                        }}
                        className="me-2"
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                       {t("checkout.paymentCash")}
                      </span>
                    </div>
                  }
                  value="Cash"
                  checked={selectedPayment === "Cash"}
                  onChange={() => handlePaymentChange("Cash")}
                />
              </Form>
             
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
  {t("checkout.checkoutSteps", { returnObjects: true }).map((step, index) => (
    <React.Fragment key={index}>
      <div className={`step ${currentStep >= index + 1 ? "completed" : ""}`}>
        <div className="circle">{index + 1}</div>
        <span>{step}</span>
      </div>
      {index < 2 && (
        <div className={`line ${currentStep > index + 1 ? "active" : ""}`}></div>
      )}
    </React.Fragment>
  ))}
</div>


      {/* Hiển thị lỗi nếu có */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
        <Col md={7}>
          {/* Hiển thị nội dung từng bước */}
          {renderStepContent()}

          {/* Nút điều hướng */}
          <div className="d-flex justify-content-between mt-3">
            {/* Nút quay lại */}
            {currentStep === 1 ? (
              <Button variant="secondary" onClick={() => navigate("/")}>
               {t("checkout.backToHome")}
              </Button>
            ) : (
              <Button variant="secondary" onClick={handlePreviousStep}>
                 {t("checkout.back")}
              </Button>
            )}
            {/* Nút tiếp tục hoặc hoàn tất */}
            {currentStep < 3 ? (
              <Button variant="dark" onClick={handleNextStep}>
                {t("checkout.continue")}
              </Button>
            ) : selectedPayment === "Cash" ? (
              <Button variant="success" onClick={handleOrdered}>
              {t("checkout.confirmOrder")}
              </Button>
            ) : selectedPayment === "Momo" ? (
              <Button variant="primary" onClick={handleCheckout}>
                 {t("checkout.proceedPayment")}
              </Button>
            ) : (
              <p>{t("checkout.selectedPaymentPlease")}</p>
            )}
          </div>
        </Col>

        {/* Tổng kết đơn hàng */}
        <Col md={5}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span>{t("checkout.totalPrice")}</span>
                <strong>{totalPrice.toLocaleString()}đ</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>{t("checkout.quantity")}</span>
                <strong>{totalQuantity}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>{t("checkout.subtotal")}</span>
                <strong>{totalPrice.toLocaleString()}đ</strong>
              </div>
            </Card.Body>
          </Card>

          {/* Sản phẩm */}
          <Card>
            <Card.Header>
              {t("checkout.checkouingProduct")}({cartItems.length})
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
                      <p className="text-muted">{t("checkout.quantity")}: {item.quantity}</p>
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
