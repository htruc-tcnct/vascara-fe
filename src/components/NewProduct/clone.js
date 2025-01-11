import React, { useState, useEffect } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../style/product-showing.css";

function ProductShowing() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t, i18n } = useTranslation();

  // Hàm định dạng tiền theo VND
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Đặt ngôn ngữ mặc định là "en" và gọi API khi component mount
  useEffect(() => {
    i18n.changeLanguage("en"); // Đặt ngôn ngữ mặc định là tiếng Anh

    // Gọi API để lấy danh sách sản phẩm
    const fetchProduct = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/products`
        );
        // Cập nhật sản phẩm với translation dựa trên ngôn ngữ hiện tại
        setProducts(
          result.data.products.map((product) => {
            const translation =
              product.translations.find((t) => t.language === i18n.language) ||
              product.translations[0];
            return { ...product, currentTranslation: translation };
          })
        );
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProduct(); // Gọi hàm lấy sản phẩm
  }, [i18n]); // Chỉ gọi một lần khi component mount

  useEffect(() => {
    // Cập nhật translation khi ngôn ngữ thay đổi
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const translation =
          product.translations.find((t) => t.language === i18n.language) ||
          product.translations[0];
        return { ...product, currentTranslation: translation };
      })
    );
  }, [i18n.language]); // Theo dõi sự thay đổi ngôn ngữ

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <Container fluid className="mt-5">
      <div className="d-flex row border-top border-bottom py-2">
        <div className="col-lg-2 col-6 text-center border-end text-style">
          <FontAwesomeIcon icon={faFilter} className="fa-icon" />{" "}
          {t("banner.filter")}
        </div>
        <div className="col-lg-8 d-lg-block d-none text-center text-style">
          {products.length} {t("banner.products_number")}
        </div>
        <div className="col-lg-2 col-6 text-center border-start text-style">
          <FontAwesomeIcon icon={faSortAmountDown} className="fa-icon" />{" "}
          {t("banner.sort")}
        </div>
      </div>
      <div className="col-sm-4 d-lg-none d-block text-style">
        {products.length} {t("banner.products_number")}
      </div>

      <div className="d-flex row mt-5">
        {products.map((product) => {
          const productName = product.currentTranslation?.name;
          return (
            <div
              key={product.product_id}
              className="col-lg-3 col-6 margin-custom product-container"
            >
              <div className="product-image-div">
                <img
                  src={product.main_image_url}
                  alt={productName}
                  className="product-image"
                />
                <div
                  className="open-quickview"
                  onClick={() => handleOpenModal(product)}
                >
                  Xem nhanh
                </div>
              </div>
              <p className="name-product">{productName}</p>
              <p className="price-product">{formatCurrency(product.price)}</p>
            </div>
          );
        })}
      </div>

      {/* Modal cho chi tiết sản phẩm */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          {selectedProduct && (
            <div className="product-details row">
              <div className="col-6">
                <img
                  src={selectedProduct.main_image_url}
                  alt={selectedProduct.currentTranslation?.name}
                  className="modal-product-image"
                />
              </div>
              <div className="col-6">
                <div className="product-info">
                  <p className="name-product fw-400 m-0">
                    {selectedProduct.currentTranslation?.name}
                  </p>
                  <p className="price-product m-0">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                  <p>Size</p>
                  <div className="sizes">
                    {(selectedProduct.currentTranslation?.description || "")
                      .split(" ")
                      .filter((size) => size.trim() !== "")
                      .map((size) => (
                        <button
                          key={size}
                          className={`size-button ${
                            selectedSize === size ? "active" : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark">{t("banner.add_to_card")}</Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("banner.deatail_product")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductShowing;
