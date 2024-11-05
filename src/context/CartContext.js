import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount") || "0", 10)
  );

  const addToCart = async (productId, quantity, size) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }
      // Gọi API để thêm sản phẩm vào giỏ hàng
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
        // Tăng số lượng giỏ hàng và lưu vào localStorage
        const newCount = cartCount + quantity;
        setCartCount(newCount);
        localStorage.setItem("cartCount", newCount);

        console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Lỗi khi thêm sản phẩm vào giỏ hàng, vui lòng thử lại.");
    }
  };

  const value = {
    cartCount,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
