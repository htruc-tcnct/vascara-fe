import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Modal,
  Button,
  Carousel,
  Form,
  Dropdown,
  Pagination,
  Spinner,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  faFilter,
  faSortAmountDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/product-showing.css";
import { Range } from "react-range";
import { useCart } from "../../context/CartContext";
const formatCurrency = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

function ProductShowing({ keyword, filters, categoryId }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Mặc định");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const handleCloseErrorModal = () => setShowErrorModal(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [ProductTotal, setProductTotal] = useState(0);
  const productsPerPage = 16;
  const [showPageInput, setShowPageInput] = useState(false);
  const [inputPage, setInputPage] = useState("");
  const isAuthenticated = localStorage.getItem("token");
  const [values, setValues] = useState([0, 1500000]);
  const minLimit = 0;
  const maxLimit = 1500000;
  const step = 10000;
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();

  const goToDetail = (product) => {
    navigate(`/product-id/${product.product_id}`);
  };
  useEffect(() => {
    const preloadImages = async () => {
      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = () => resolve(src); // Resolve even if there's an error
        });
      };

      const imagePromises = products.map((product) => {
        const productImage = product.isHovered
          ? product.hover_image_url
          : product.main_image_url;
        return loadImage(productImage).then((src) => ({
          id: product.product_id,
          src,
        }));
      });

      const loadedImagesArray = await Promise.all(imagePromises);
      const loadedImagesMap = loadedImagesArray.reduce((acc, { id, src }) => {
        acc[id] = src;
        return acc;
      }, {});

      setLoadedImages(loadedImagesMap);
    };

    preloadImages();
  }, [products]);
  const handleQuantityChange = (event) => {
    const value = Math.max(0, event.target.value); // Đảm bảo số lượng ít nhất là 1
    setQuantity(value);
  };
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("chua dang nhap");
      return;
    }

    addToCart(selectedProduct.product_id, quantity, selectedSize);
    setShowModal(false);
  };
  const handlePageInputSubmit = () => {
    const page = Number(inputPage);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setShowPageInput(false); // Hide input after submitting
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/categories`
        );

        // Mảng bản dịch tiếng Anh
        const englishTranslations = [
          { category_id: 1, name: "Shoes/Sandals" },
          { category_id: 2, name: "Wallet" },
          { category_id: 3, name: "Bag/Backpack" },
        ];

        // Kết hợp bản dịch tiếng Việt và tiếng Anh
        const categoriesWithTranslations = response.data.categories.map(
          (category) => {
            const englishTranslation = englishTranslations.find(
              (en) => en.category_id === category.category_id
            );
            return {
              ...category,
              name_en: englishTranslation
                ? englishTranslation.name
                : category.name,
            };
          }
        );

        setCategories(categoriesWithTranslations);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleComplete = useCallback(
    async (sortOption = "", page = 1) => {
      try {
        setLoading(true);
        const sortSelect =
          sortOption === "Giá tăng dần" || sortOption === "Price Increase"
            ? "price_asc"
            : sortOption === "Giá giảm dần" || sortOption === "Price Descrease"
            ? "price_desc"
            : "";

        setSelectedSort(sortOption);
        const categoryID =
          categoryId === undefined ? selectedCategory : categoryId;

        const filterParams = new URLSearchParams({
          limit: productsPerPage,
          page,
          ...(categoryID && { category_id: categoryID }),
          ...(values && {
            priceRange: `${values[0]}-${values[1]}`,
          }),
          ...(sortSelect && { sortSelect }),
          ...(keyword && { keyword }),
        }).toString();

        const filterToSearch = filterParams;
        console.log(`${values[0]}-${values[1]}`);

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/products/filter?${filterToSearch}`
        );
        const updatedProducts = response.data.products.map((product) => {
          const translation =
            product.translations.find((t) => t.language === i18n.language) ||
            product.translations[0];
          return { ...product, currentTranslation: translation };
        });
        setProducts(updatedProducts);
        setProductTotal(response.data.pagination.totalProducts);
        const totalProducts = response.data.pagination.totalProducts;
        setAllProducts(totalProducts);
        settotalPages(Math.ceil(totalProducts / productsPerPage));
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response || error.message
        );
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    },
    [
      productsPerPage,
      selectedCategory,
      selectedPrices,
      keyword,
      filters,
      values,
    ]
  );

  useEffect(() => {
    handleComplete(selectedSort, currentPage);
  }, [handleComplete, currentPage, selectedSort]);

  useEffect(() => {
    if (selectedProduct) {
      selectedProduct.product_images.forEach((image) => {});
    }
  }, [selectedProduct]);
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSelectedPrices([]);
  };

  const clearAllPrices = () => {
    setSelectedPrices([]); // Xóa tất cả các giá đã chọn
  };

  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const translation =
          product.translations.find((t) => t.language === i18n.language) ||
          product.translations[0];
        return { ...product, currentTranslation: translation };
      })
    );
  }, [i18n.language, allProducts, currentPage]); // Thêm `products` làm phụ thuộc

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setShowModal(true);
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

  const handleMouseLeave = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId
          ? { ...product, isHovered: false }
          : product
      )
    );
  };
  const [showFilter, setShowFilter] = useState(false);
  const handleCloseFilter = () => setShowFilter(false);
  const handleShowFilter = () => setShowFilter(true);
  // Hàm định dạng tiền theo VND
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container
      fluid
      className="mt-3"
      style={{
        minHeight: "2300px",
        width: "100%",
      }}
    >
      <div className="d-flex align-items-center row border-top border-bottom py-2">
        <div
          className="col-lg-3 col-6 text-center border-end text-style"
          onClick={handleShowFilter}
        >
          <FontAwesomeIcon icon={faFilter} className="fa-icon" />{" "}
          {t("banner.filter")}
        </div>
        {/* Filter */}
        <Offcanvas show={showFilter} onHide={handleCloseFilter} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{t("banner.filter")}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div>
              <h5 className="filter-section-title">{t("banner.category")}</h5>
              <div className="filter-options">
                {categories.map((category) => (
                  <Button
                    key={category.category_id}
                    variant={
                      selectedCategory === category.category_id
                        ? "secondary"
                        : "outline-secondary"
                    }
                    className="filter-button"
                    onClick={() => handleCategorySelect(category.category_id)}
                  >
                    {i18n.language === "en" ? category.name_en : category.name}
                  </Button>
                ))}
              </div>

              <h5 className="filter-section-title mt-4">{t("banner.price")}</h5>
              <div className="dual-range-slider">
                <Range
                  values={values}
                  step={step}
                  min={minLimit}
                  max={maxLimit}
                  onChange={(newValues) => {
                    setValues(newValues);
                    console.log(newValues);
                  }} // Cập nhật giá trị ngay lập tức khi kéo
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        background: "#ddd",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          height: "6px",
                          background: "#5c5c5c",
                          borderRadius: "3px",
                          left: `${
                            ((values[0] - minLimit) / (maxLimit - minLimit)) *
                            100
                          }%`,
                          right: `${
                            100 -
                            ((values[1] - minLimit) / (maxLimit - minLimit)) *
                              100
                          }%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "16px",
                        width: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#5c5c5c",
                        cursor: "pointer",
                      }}
                    />
                  )}
                />
                <div className="text-center mt-2">
                  <span>
                    {values[0].toLocaleString()} VND -{" "}
                    {values[1].toLocaleString()} VND
                  </span>
                </div>
              </div>
            </div>
            <Modal
              show={showErrorModal}
              onHide={handleCloseErrorModal}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Thông báo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Lỗi khi lấy dữ liệu từ server hoặc không có sản phẩm. Vui lòng
                  thử lại!
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleCloseErrorModal}>
                  Đóng
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="dark"
                className="w-100 mb-2"
                onClick={handleComplete}
              >
                {t("banner.complete")}
              </Button>
              <Button
                variant="link"
                className="w-100 text-center"
                onClick={() => {
                  setSelectedCategory(null);
                  clearAllPrices();
                }}
              >
                {t("banner.clear")}
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <div className="col-lg-6 d-lg-block d-none text-center text-style align-item-center">
          {ProductTotal} {t("banner.products_number")}
        </div>
        <div className="col-lg-3 col-6 text-center border-start text-style">
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="bg-white border-0"
            >
              <FontAwesomeIcon icon={faSortAmountDown} className="fa-icon" />{" "}
              {t("banner.sort")}
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Item
                className="dropdown-item-custom"
                onClick={() => handleComplete("Mặc định")}
              >
                {t("banner.default")}
                {selectedSort === "Mặc định" && (
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                )}
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item
                className="dropdown-item-custom"
                onClick={() => {
                  handleComplete("Giá tăng dần");
                  handleComplete("Price Increase");
                }}
              >
                {t("banner.increse_price")}
                {selectedSort === "Giá tăng dần" && (
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                )}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                className="dropdown-item-custom"
                onClick={() => {
                  handleComplete("Giá giảm dần");
                  handleComplete("Price Descrease");
                }}
              >
                {t("banner.decrease_price")}

                {selectedSort === "Giá giảm dần" && (
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                )}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="col-sm-4 d-lg-none d-block text-style">
        {ProductTotal} {t("banner.products_number")}
      </div>

      <div className="d-flex row mt-5">
        {loading ? (
          <div className="text-center my-4">
            {/* <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> */}
          </div>
        ) : (
          <div className="d-flex row mt-5 loadImage">
            {products.map((product) => {
              const productName = product.currentTranslation?.name;
              const productImage =
                loadedImages[product.product_id] || product.main_image_url;

              return (
                <div
                  key={product.product_id}
                  className="col-lg-3 col-6 margin-custom product-container"
                >
                  <div
                    className="product-image-div"
                    onMouseEnter={() => handleMouseEnter(product.product_id)}
                    onMouseLeave={() => handleMouseLeave(product.product_id)}
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
          </div>
        )}
        {/* Pagination Component */}
        <Pagination className="mt-4 pagination" style={{ minHeight: "45px" }}>
          <Pagination.First onClick={() => handlePageChange(1)} />

          {/* Previous Page */}
          <Pagination.Prev
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          />

          {/* First two pages */}
          <Pagination.Item
            active={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
          {totalPages > 1 && (
            <Pagination.Item
              active={currentPage === 2}
              onClick={() => handlePageChange(2)}
            >
              2
            </Pagination.Item>
          )}

          {/* Ellipsis with Input Option */}
          {totalPages > 4 && (
            <>
              {showPageInput ? (
                <Form
                  inline
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePageInputSubmit();
                  }}
                >
                  <Form.Control
                    type="number"
                    placeholder="Page"
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    style={{ width: "60px", marginRight: "5px" }}
                  />
                  <Button size="sm" onClick={handlePageInputSubmit}>
                    Go
                  </Button>
                </Form>
              ) : (
                <Pagination.Ellipsis onClick={() => setShowPageInput(true)} />
              )}
            </>
          )}

          {/* Penultimate and Last Pages */}
          {totalPages > 3 && (
            <Pagination.Item
              active={currentPage === totalPages - 1}
              onClick={() => handlePageChange(totalPages - 1)}
            >
              {totalPages - 1}
            </Pagination.Item>
          )}
          {totalPages > 2 && (
            <Pagination.Item
              active={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Pagination.Item>
          )}

          {/* Next and Last Page */}
          <Pagination.Next
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
          />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </Pagination>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          {selectedProduct && (
            <div className="product-details row">
              <div className="col-6">
                {selectedProduct.product_images &&
                selectedProduct.product_images.length > 0 ? (
                  <Carousel>
                    {selectedProduct.product_images.map((image, index) => (
                      <Carousel.Item key={image.image_id}>
                        <Image
                          src={image.image_url}
                          alt={`Slide ${image.image_id}`}
                          className="d-block w-100 modal-product-image"
                          loading="lazy" // Enables lazy loading
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
                    className="d-block w-100 modal-product-image "
                    loading="lazy"
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
    </Container>
  );
}

export default ProductShowing;
