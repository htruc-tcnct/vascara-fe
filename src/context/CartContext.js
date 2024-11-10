import React, { createContext, useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount") || "0", 10)
  );
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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
    setShowModal(display);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập!");
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
          handleShowModal();
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Lỗi khi thêm sản phẩm vào giỏ hàng, vui lòng thử lại.");
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
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng, vui lòng thử lại.");
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
        // Cập nhật cartCount dựa trên sự thay đổi thực tế về số lượng
        const newCount = cartCount + quantityChange;
        setCartCount(newCount);
        localStorage.setItem("cartCount", newCount);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", err);
      alert("Lỗi khi cập nhật sản phẩm trong giỏ hàng, vui lòng thử lại.");
    }
  };

  const value = {
    cartCount,
    addToCart,
    removeWithout,
    updateCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Modal thông báo thêm thành công */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "white", borderBottom: "none" }}
        >
          <Modal.Title style={{ color: "#121212" }}>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "white",
            color: "#121212",
            textAlign: "center",
          }}
        >
          Sản phẩm đã được thêm vào giỏ hàng thành công!
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "white", borderTop: "none" }}>
          <Button
            style={{
              backgroundColor: "#121212",
              color: "white",
              borderColor: "#121212",
            }}
            onClick={handleCloseModal}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </CartContext.Provider>
  );
};

export default CartProvider;
