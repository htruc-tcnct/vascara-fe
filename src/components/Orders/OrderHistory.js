import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Button,
  Modal,
  Image,
  Carousel,
} from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./style.css";

const OrderHistory = () => {
  const { t, i18n } = useTranslation(); // Hook for translation
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch order data from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const idUser = localStorage.getItem("idUser");
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/order/getAllById/${idUser}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <Container>
      <h2>{t("orderHistory.title")}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("orderHistory.columns.number")}</th>
            <th>{t("orderHistory.columns.totalPrice")}</th>
            <th>{t("orderHistory.columns.status")}</th>
            <th>{t("orderHistory.columns.orderDate")}</th>
            <th>{t("orderHistory.columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.order_id}>
              <td>{index + 1}</td>
              <td>{parseFloat(order.total_price).toLocaleString()} VND</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleViewDetails(order)}
                >
                  {t("orderHistory.viewDetails")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("orderHistory.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>{t("orderHistory.modal.orderDate")}:</strong>{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString()}
              </p>
              <h5>{t("orderHistory.modal.items")}:</h5>
              <Carousel interval={null} wrap={false} indicators={false}>
                {selectedOrder.OrderItems.map((item, itemIndex) => {
                  const product =
                    item.Product.translations.find(
                      (t) => t.language === "en"
                    ) || item.Product.translations[0];

                  return (
                    <Carousel.Item key={itemIndex}>
                      <div className="d-flex flex-column align-items-center text-center">
                        <Image
                          src={item.Product.main_image_url}
                          alt={product?.name || "Product Image"}
                          style={{ maxWidth: "300px", marginBottom: "5px" }}
                          rounded
                        />
                        <p className="fs-5">
                          {item.Product.translations.find(
                            (translation) =>
                              translation.language === i18n.language
                          )?.name || t("N/A")}{" "}
                          ({item.size}) <strong>x {item.quantity}</strong>
                        </p>

                        <p>
                          <strong>{t("orderHistory.modal.totalPrice")}:</strong>{" "}
                          {parseFloat(item.price).toLocaleString()} VND
                        </p>
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
              <p className="mt-4">
                <strong>{t("orderHistory.modal.totalPrice")}:</strong>{" "}
                {parseFloat(selectedOrder.total_price).toLocaleString()} VND
              </p>
              <p>
                <strong>{t("orderHistory.modal.status")}:</strong>{" "}
                {selectedOrder.status}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("orderHistory.modal.close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderHistory;
