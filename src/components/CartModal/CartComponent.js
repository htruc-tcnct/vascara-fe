import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useCart } from "../../context/CartContext";

function CartComponent() {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const { addToCart, removeWithout, updateCart } = useCart();

  // Tính tổng giá trị đơn hàng
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
  // Hàm tăng số lượng
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

  // Hàm giảm số lượng
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

  return (
    <div className="container my-5">
      <h4 className="mb-4">Giỏ hàng của bạn</h4>
      <Row>
        <Col md={8}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Card className="mb-3" key={item.cartItemId}>
                <Row className="g-0">
                  <Col md={3}>
                    <img
                      src={item.mainImageUrl}
                      alt={item.name}
                      className="img-fluid rounded-start"
                    />
                  </Col>
                  <Col md={9}>
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        Màu: {item.color} | Size: {item.size}
                      </Card.Text>
                      <Card.Text>
                        Giá: {Math.round(item.price).toLocaleString()}đ
                      </Card.Text>
                      <div className="d-flex align-items-center">
                        <span className="me-2">Số lượng:</span>
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
                        onClick={() =>
                          handleDeleteItem(item.cartItemId, item.quantity)
                        }
                      >
                        Xóa
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <p>Giỏ hàng của bạn hiện đang trống.</p>
          )}
        </Col>

        <Col md={4}>
          <Card className="p-3" style={{ backgroundColor: "#F8F9FA" }}>
            <Card.Body>
              <Card.Text className="text-success">
                Miễn phí giao hàng cho đơn từ 899K (tối đa 30K)
              </Card.Text>
              <hr />
              <Row>
                <Col>Giá trị đơn hàng</Col>
                <Col className="text-end">{totalAmount.toLocaleString()}đ</Col>
              </Row>
              <Row>
                <Col>Số lượng</Col>
                <Col className="text-end">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </Col>
              </Row>
              <Row>
                <Col>Giảm tiền</Col>
                <Col className="text-end">0đ</Col>
              </Row>
              <hr />
              <Row>
                <Col>Thành tiền</Col>
                <Col className="text-end">
                  <strong>{totalAmount.toLocaleString()}đ</strong>
                </Col>
              </Row>
              <Button
                variant="dark"
                className="w-100 mt-3"
                style={{ backgroundColor: "#121212", borderColor: "#121212" }}
              >
                Đi đến thanh toán
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartComponent;
