import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CartComponent() {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const { addToCart, removeWithout, updateCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [colSize, setColSize] = useState(3); 
  // Calculate the total amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function to navigate to the checkout page with cartItems as state
  const gotoCheckOut = () => {
    navigate("/cart/checkout", { state: { cartItems } }); // Pass cartItems as state
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem("idUser");
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/carts`,
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched cart items:", response.data.cartItems);
        setCartItems(response.data.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [token]);

  const handleDeleteItem = async (cartItemId, quantity) => {
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

  // Increase quantity
  const handleIncreaseQuantity = (itemId, size) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    updateCart(itemId, 1);
  };

  // Decrease quantity
  const handleDecreaseQuantity = (itemId, size, currentQuantity) => {
    if (currentQuantity > 1) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      updateCart(itemId, -1);
    }
  };

  const getProductName = (translations) => {
    return translations[i18n.language] || "Product";
  };

  return (
    <div className="container my-5">
      <h4 className="mb-4">Giỏ hàng của bạn</h4>

      <Row>
        <Col md={8}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Card className="mb-3" key={item.cartItemId}>
                <Row className="g-0">
                  <Col lg={3} xs={3}>
                    <img
                      src={item.mainImageUrl}
                      alt={item.name}
                      className="img-fluid rounded-start"
                    />
                  </Col>
                  <Col lg={9} xs={9}>
                    <Card.Body>
                      <Card.Title>
                        {getProductName(item.translations)}
                      </Card.Title>
                      {/* Size and Price on the same line */}
                      <div className="d-flex justify-content-between">
                        <Card.Text>
                          {t("product-detail.Size")}: {item.size}
                        </Card.Text>
                        <Card.Text className="fs-6">
                          {t("product-detail.Price")}:{" "}
                          {Math.round(item.price).toLocaleString()}đ
                        </Card.Text>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          {t("product-detail.Quantity")}:
                        </span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleDecreaseQuantity(
                              item.cartItemId,
                              item.size,
                              item.quantity
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleIncreaseQuantity(item.cartItemId, item.size)
                          }
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 mt-2 text-secondary"
                        style={{ textDecoration: "underline" }}
                        onClick={() =>
                          handleDeleteItem(item.cartItemId, item.quantity)
                        }
                      >
                        {t("product-detail.Delete")}
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
                <hr />
              </Card>
            ))
          ) : (
            <p>{t("product-detail.empty-cart")}</p>
          )}
        </Col>

        <Col md={4}>
          <Card className="p-3" style={{ backgroundColor: "#F8F9FA" }}>
            <Card.Body>
              <Card.Text className="text-success">
                {t("product-detail.freeship")}
              </Card.Text>
              <hr />
              <Row>
                <Col>{t("product-detail.totalOrder")}</Col>
                <Col className="text-end">{totalAmount.toLocaleString()}đ</Col>
              </Row>
              <Row>
                <Col>{t("product-detail.Quantity")}</Col>
                <Col className="text-end">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </Col>
              </Row>
              <Row>
                <Col>{t("product-detail.reduce-price")}</Col>
                <Col className="text-end">0đ</Col>
              </Row>
              <hr />
              <Row>
                <Col>{t("product-detail.totalPrice")}</Col>
                <Col className="text-end">
                  <strong>{totalAmount.toLocaleString()}đ</strong>
                </Col>
              </Row>
              <Button
                onClick={gotoCheckOut}
                variant="dark"
                className="w-100 mt-3"
                style={{ backgroundColor: "#121212", borderColor: "#121212" }}
              >
                {t("product-detail.go-to-check-out")}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartComponent;
