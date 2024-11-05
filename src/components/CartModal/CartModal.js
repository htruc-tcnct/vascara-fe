import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import "./CartIcon.css";
import axios from "axios";

const CartModal = ({ show, userId, cartCount }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/carts`,
        {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(data.cartItems);
      console.log("Fetched cart data:", data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (show && userId) {
      // Only fetch when modal is shown and userId is available
      fetchCart();
    }
  }, [show, userId, cartCount]); // Re-fetch when show, userId, or cartCount changes

  return (
    <Dropdown show={show}>
      <Dropdown.Menu className="cart-dropdown" align="end">
        <Dropdown.Header>Giỏ hàng của bạn</Dropdown.Header>
        <div className="cart-items">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img
                  src={item.mainImageUrl}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-color-size">
                    Màu: {item.color} | Size: {item.size}
                  </p>
                  <p className="item-price">
                    Giá: {item.price.toLocaleString()}đ
                  </p>
                  <p className="item-quantity">Số lượng: {item.quantity}</p>
                </div>
                <button className="item-remove">Xóa</button>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn hiện đang trống.</p>
          )}
        </div>
        {cartItems && cartItems.length > 0 && (
          <>
            <div className="cart-subtotal">
              <p>Tặng 1 đôi vớ cotton cho đơn chỉ từ 699K</p>
              <p>Miễn phí giao hàng cho đơn từ 899K (tối đa 30K)</p>
            </div>
            <Dropdown.Item as="button" className="view-cart-btn">
              Xem chi tiết giỏ hàng
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CartModal;
