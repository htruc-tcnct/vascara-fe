import React, { createContext, useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount") || "0", 10)
  );
  const [isConfirmOrder, setIsConfirmOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const { t } = useTranslation(); // Sử dụng hook `useTranslation`
  const [orderDetails, setOrderDetails] = useState({});
  const handleCloseModal = () => {
    setShowModal(false);
    setIsConfirmOrder(false);
  };
  const handleOrdered = async () => {
    setIsConfirmOrder(false);
    try {
      const requestBody = {
        cartItemList: orderDetails.cartItems,
        addressId: orderDetails.selectedAddressId,
        isCheckOut: false,
      };
      console.log("Đơn hàng đã được xác nhận!");
      console.log("Cart Items:", orderDetails.cartItems);
      console.log("Selected Address ID:", orderDetails.selectedAddressId);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/order/add`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setModalMessage("ĐƠn hàng tạo mới thành công");
        setShowModal(true);
        localStorage.removeItem("checkoutCurrentStep");

        navigate("/thank-you");
      } else {
        console.error("Unexpected response:", response);
        setModalMessage("Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Lỗi khi gửi đơn hàng, vui lòng thử lại sau.");
    }
  };
  const fetchCartCount = async () => {
    try {
      const idUser = localStorage.getItem("idUser");
      const token = localStorage.getItem("token");

      if (!idUser || !token) return;

      const result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/carts`,
        {
          params: { userId: idUser },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const fetchedCartCount = result.data.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );
      setCartCount(fetchedCartCount);
      localStorage.setItem("cartCount", fetchedCartCount);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const addToCart = async (productId, quantity, size, display = true) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setModalMessage(t("alerts.notLoggedIn")); // Hiển thị thông báo đăng nhập
        setShowModal(true);

        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/carts/add`,
        {
          product_id: productId,
          quantity: quantity,
          size: size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const newCount = cartCount + quantity;
        setCartCount(newCount);
        localStorage.setItem("cartCount", newCount);

        if (display) {
          setModalMessage(t("notification.successAdd")); // Sử dụng key cho thông báo thành công
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setModalMessage(t("notification.errorAdd")); // Sử dụng key cho thông báo lỗi
      setShowModal(true);
    }
  };

  const removeWithout = async (cartItemId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/carts`,
        {
          params: { idCart: cartItemId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newCount = cartCount - quantity;
        setCartCount(newCount);
        localStorage.setItem("cartCount", newCount);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      setModalMessage(t("notification.errorDelete")); // Sử dụng key cho thông báo lỗi
      setShowModal(true);
    }
  };

  const updateCart = async (cartId, quantityChange) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/carts`,
        null,
        {
          params: { cartItemId: cartId, quantity: quantityChange },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newCount = cartCount + quantityChange;
        setCartCount(newCount);
        localStorage.setItem("cartCount", newCount);
      }
    } catch (err) {
      console.error("Error updating product in cart:", err);
      setModalMessage(t("notification.errorUpdate")); // Sử dụng key cho thông báo lỗi
      setShowModal(true);
    }
  };
  const updateInfor = async (success, fail) => {
    if (success) {
      setModalMessage(t("profile.update-success"));
    }
    if (fail) {
      setModalMessage(t("profile.update-error"));
    }
    setShowModal(true);
  };
  const confirmOrder = (cartItems, selectedAddressId) => {
    setModalMessage(t("notification.confirmOrder"));
    setShowModal(true);
    setOrderDetails({ cartItems, selectedAddressId });
    setIsConfirmOrder(true);
    localStorage.removeItem("checkoutCurrentStep");
  };
  const value = {
    cartCount,
    addToCart,
    removeWithout,
    updateCart,
    confirmOrder,
    updateInfor,
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Modal thông báo */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("modal.title")}</Modal.Title> {/* Tiêu đề Modal */}
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCloseModal}
            style={{
              boder: "1px solid rgb(18, 18, 18)",
              backgroundColor: "#dee2e6",
              color: "#25282B",
            }}
          >
            {t("modal.close")} {/* Nút đóng Modal */}
          </Button>
          {isConfirmOrder && (
            <Button
              style={{ backgroundColor: "rgb(18, 18, 18)" }}
              onClick={handleOrdered}
              variant="primary"
            >
              {t("modal.confirm")}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </CartContext.Provider>
  );
};

export default CartProvider;
