import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Image,
  Accordion,
  Modal,
  Carousel,
  Button,
} from "react-bootstrap";
import Slider from "react-slick";
import axios from "axios";
import "./ProductDetail.css";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
function ProductDetail() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [loadedImages, setLoadedImages] = useState({});
  const { t, i18n } = useTranslation();
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const handleNavigate = () => {
    if (categoryName === "Ví") {
      navigate("/wallet?category_id=2&filter=all");
    } else if (categoryName === "Giày/Dép") {
      navigate("/sandal?category_id=3&filter=all");
    } else if (categoryName === "Túi/Balo") {
      navigate("/bag?filter=all");
    }
  };
  const handleAddToCart = () => {
    addToCart(productId, quantity, selectedSize);
  };
  const handleBuy = () => {
    addToCart(productId, quantity, selectedSize, false);
    navigate("/cart");
    window.location.reload();
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
  const handleMouseEnter = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId
          ? { ...product, isHovered: true }
          : product
      )
    );
  };

  const handleMouseLeavea = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId
          ? { ...product, isHovered: false }
          : product
      )
    );
  };

  const handleMouseMove = (e) => {
    const zoomImage = e.target;
    const rect = zoomImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${selectedImage})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleQuantityChange = (operation) => {
    setQuantity((prevQuantity) =>
      operation === "increment"
        ? prevQuantity + 1
        : Math.max(1, prevQuantity - 1)
    );
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setShowModal(true);
  };

  const handleComplete = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/products/filter?limit=8`
      );
      const updatedProducts = response.data.products.map((product) => {
        const translation =
          product.translations.find((t) => t.language === i18n.language) ||
          product.translations[0];
        return { ...product, currentTranslation: translation };
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [i18n.language]);

  const goToDetail = (product) => {
    navigate(`/product-id/${product.product_id}`);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/products/product-detail/${productId}`
        );
        const productData = response.data.product;

        if (productData) {
          productData.originalPrice = Math.round(productData.price * 1.06);
          setProduct(productData);

          setSelectedSize(productData.sizes?.[0]?.size || null);
          setSelectedImage(productData.main_image_url);

          const categoryNames = productData.category.name;

          console.log("Category Name:", categoryNames);
          setCategoryName(categoryNames);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) fetchProduct();
    return () => {
      handleComplete();
    };
  }, [productId, handleComplete]); // Chạy lại khi productId thay đổi

  const formatDescription = (description) => {
    if (!description) return <p>No description available.</p>;

    const lines = description.split("\r\n");
    return (
      <ul>
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    );
  };

  if (!product) {
    return <p>Loading...</p>;
  }
  const settings = {
    infinite: true, // Cho phép quay lại đầu sau khi đến cuối
    speed: 500, // Thời gian chuyển slide (ms)
    slidesToShow: 4, // Mặc định số sản phẩm hiển thị
    slidesToScroll: 1, // Số sản phẩm sẽ chuyển mỗi lần  arrows: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // Khi màn hình có độ rộng 1024px trở lên
        settings: {
          slidesToShow: 4, // Hiển thị 4 sản phẩm
        },
      },
      {
        breakpoint: 768, // Khi màn hình có độ rộng 768px trở xuống (tablet và mobile)
        settings: {
          slidesToShow: 2, // Hiển thị 2 sản phẩm
        },
      },
      {
        breakpoint: 480, // Khi màn hình có độ rộng 480px trở xuống (mobile)
        settings: {
          slidesToShow: 2, // Hiển thị 1 sản phẩm
        },
      },
    ],
  };
  return (
    <Container className="product-detail-container mt-3">
      <div className="mb-4">
        <a href="/">{t("new_arrivals")}</a> -{" "}
        {categoryName === "Ví" ? (
          <a href="/wallet?category_id=2&filter=all">{t("menu.wallets")}</a>
        ) : categoryName === "Giày/Dép" ? (
          <a href="/sandal?category_id=3&filter=all">{t("menu.shoes")}</a>
        ) : categoryName === "Túi/Balo" ? (
          <a href="/bag?filter=all">{t("menu.bags")}</a>
        ) : (
          <a href={`/category/${categoryName}`}>{categoryName}</a>
        )}
      </div>

      <div className="smartphone-dis d-lg-none d-block">
        <h5 className="product-name">
          {product.translations.find((u) => u.language === i18n.language)?.name}
        </h5>
        <div className="price-section">
          <span className="current-price">
            {Number(product.price).toLocaleString()}đ
          </span>
          <span className="old-price">
            {Number(product.originalPrice).toLocaleString()}đ
          </span>
          <span className="discount">
            -
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            %
          </span>
        </div>
      </div>
      <Row>
        <Col md={6} className="image-section">
          <div className="product-images">
            <div
              className="main-image-wrapper"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={selectedImage}
                alt={product.translations[0]?.name || "Product"}
                className="main-image"
              />
              <div className="zoomed-image" style={zoomStyle}></div>
            </div>
            <div className="thumbnail-container mt-3">
              <div className="thumbnail-scroll">
                {product.product_images.map((image) => (
                  <div
                    key={image.image_id}
                    className="thumbnail-item"
                    onClick={() => setSelectedImage(image.image_url)}
                  >
                    <Image
                      src={image.image_url}
                      alt={`Thumbnail ${image.image_id}`}
                      className="thumbnail-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="product-info">
            <h5 className="product-name d-lg-block d-none">
              {
                product.translations.find((u) => u.language === i18n.language)
                  ?.name
              }
            </h5>
            <div className="price-section">
              <span className="current-price">
                {Number(product.price).toLocaleString()}đ
              </span>
              <span className="old-price">
                {Number(product.originalPrice).toLocaleString()}đ
              </span>
              <span className="discount">
                -
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </span>
            </div>
            <div className="product-sizes mt-2">
              <p>Size:</p>
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`custom-btn ${
                    selectedSize === size.size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
            <div className="product-quantity mt-3">
              <p>{t("product-detail.Quantity")}</p>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange("decrement")}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </button>
              </div>
            </div>
            <div className="product-actions mt-4">
              <button
                className="custom-btn-primary buy-now me-2"
                onClick={handleBuy}
              >
                {t("detail-product.buy-now")}
              </button>
              <button
                className="custom-btn-secondary add-to-cart"
                onClick={handleAddToCart}
              >
                {t("detail-product.add-to-cart")}
              </button>
            </div>
            <Accordion className="expandable-sections mt-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  {" "}
                  {t("detail-product.your-vouncher")}
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>{t("detail-product.vouncher1")}</li>
                    <li>
                      {t("detail-product.vouncher2")}
                      <a href="#detail" style={{ textDecoration: "underline" }}>
                        {t("detail-product.go-to-detail")}
                      </a>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  {" "}
                  {t("detail-product.inf-product")}
                </Accordion.Header>
                <Accordion.Body>
                  {formatDescription(product.category?.description) ||
                    "Không có mô tả."}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <h3>{t("detail-product.same-product")}</h3>
        <div className="d-flex row mt-2 loadImage">
          <Slider {...settings}>
            {products.map((product) => {
              const productName = product.currentTranslation?.name;
              const productImage = product.isHovered
                ? product.hover_image_url
                : product.main_image_url;

              return (
                <div key={product.product_id} className="product-container">
                  <div
                    className="product-image-div"
                    onMouseEnter={() => handleMouseEnter(product.product_id)}
                    onMouseLeave={() => handleMouseLeavea(product.product_id)}
                  >
                    <Image
                      src={productImage}
                      alt={productName}
                      className="product-image"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToDetail(product)}
                    />
                    <div
                      className="open-quickview"
                      onClick={() => handleOpenModal(product)}
                    >
                      {t("banner.quick-view")}
                    </div>
                  </div>
                  <p className="name-product">{productName}</p>
                  <p className="price-product">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          {selectedProduct && (
            <div className="product-details row">
              <div className="col-6">
                {selectedProduct.product_images &&
                selectedProduct.product_images.length > 0 ? (
                  <Carousel controls={false}>
                    {selectedProduct.product_images.map((image, index) => (
                      <Carousel.Item key={image.image_id}>
                        <Image
                          src={image.image_url}
                          alt={`Slide ${image.image_id}`}
                          className="d-block w-100 modal-product-image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <Image
                    src={
                      selectedProduct.main_image_url ||
                      "https://via.placeholder.com/150"
                    }
                    alt={selectedProduct.currentTranslation?.name}
                    className="d-block w-100 modal-product-image"
                  />
                )}
              </div>

              {/* Thông tin sản phẩm */}
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
                    {selectedProduct.sizes.map(({ size }) => (
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

                  {/* Biểu tượng chọn số lượng */}
                  <div className="quantity-selector mt-3">
                    <p>Quantity:</p>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="0"
                      className="form-control quantity-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="dark"
            onClick={() => handleAddToCart(quantity)} // Truyền số lượng khi thêm vào giỏ hàng
          >
            {t("banner.add_to_card")}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("banner.deatail_product")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Button
        variant="primary"
        className="btn-custom btn-lg mx-auto d-block text-center rounded-1"
        style={{
          backgroundColor: "#F5F5F5",
          borderColor: "#25282B",
          width: "12rem",
          color: "#25282B",
        }}
        onClick={handleNavigate}
      >
        {t("detail-product.see-more")}
      </Button>
    </Container>
  );
}

export default ProductDetail;
