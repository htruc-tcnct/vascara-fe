import React, { useState, useEffect } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import "./CartIcon.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartModal = ({ show, onHide, cartCount }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false); // Detect if the device is mobile
  const token = localStorage.getItem("token");
  const { removeWithout } = useCart();
  const userId = localStorage.getItem("idUser");

  const gotoCart = () => {
    navigate("/cart");
  };

  // Device detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile devices typically have a width <= 768px
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize); // Update on resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  const getProductName = (translations) => {
    return translations[i18n.language] || "Product";
  };

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/carts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(data.cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleDeleteItems = async (cartItemId, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.cartItemId !== cartItemId
      );

      const newCount = updatedItems.length;
      localStorage.setItem("cartCount", newCount);

      return updatedItems;
    });
    removeWithout(cartItemId, quantity);
  };

  useEffect(() => {
    if (show && userId) {
      fetchCart();
    }
  }, [show, userId, cartCount]);

  // Dropdown implementation for laptops
  const LaptopCartModal = () => (
    <Dropdown show={show} style={{ width: "40%" }}>
      <Dropdown.Menu className="cart-dropdown" align="end">
        <Dropdown.Header>{t("product-detail.your-cart")}</Dropdown.Header>
        <hr />
        <div className="cart-items-container">
          <div className="cart-items">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img
                    src={item.mainImageUrl}
                    alt={getProductName(item.translations)}
                    className="item-image"
                  />
                  <div className="item-details">
                    <p className="item-name" style={{ fontSize: "12px" }}>
                      {getProductName(item.translations)}
                    </p>
                    <p className="item-details-inline">
                      {t("product-detail.Size")}: {item.size} |{" "}
                      {t("product-detail.Price")}:{" "}
                      {Math.round(item.price).toLocaleString()}đ
                    </p>

                    <p className="item-quantity">
                      {t("product-detail.Quantity")}: {item.quantity}
                    </p>
                  </div>
                  <button
                    className="item-remove"
                    onClick={() =>
                      handleDeleteItems(item.cartItemId, item.quantity)
                    }
                  >
                    {t("product-detail.Delete")}
                  </button>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "14px", textAlign: "center" }}>
                {t("product-detail.empty-cart")}
              </p>
            )}
          </div>
          {cartItems && cartItems.length > 0 && (
            <div className="cart-footer">
              <Dropdown.Item
                as="button"
                className="view-cart-btn"
                onClick={gotoCart}
              >
                {t("product-detail.go-to-cart")}
              </Dropdown.Item>
            </div>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );

  // Modal implementation for smartphones
  const MobileCartModal = () => (
    <Modal show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("product-detail.your-cart")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img
                src={item.mainImageUrl}
                alt={getProductName(item.translations)}
                className="item-image"
              />
              <div className="item-details">
                <p className="item-name">{getProductName(item.translations)}</p>
                <p>
                  {t("product-detail.Size")}: {item.size} |{" "}
                  {t("product-detail.Price")}:{" "}
                  {Math.round(item.price).toLocaleString()}đ
                </p>
                <p>
                  {t("product-detail.Quantity")}: {item.quantity}
                </p>
              </div>
              <button
                className="item-remove"
                onClick={() =>
                  handleDeleteItems(item.cartItemId, item.quantity)
                }
              >
                {t("product-detail.Delete")}
              </button>
            </div>
          ))
        ) : (
          <p>{t("product-detail.empty-cart")}</p>
        )}
      </Modal.Body>
      {cartItems && cartItems.length > 0 && (
        <Modal.Footer>
          <button className="view-cart-btn" onClick={gotoCart}>
            {t("product-detail.go-to-cart")}
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );

  // Conditional rendering
  return isMobile ? <MobileCartModal /> : <LaptopCartModal />;
};

export default CartModal;
