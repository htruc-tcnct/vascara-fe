import React, { useState, useEffect, useMemo } from "react";
import { Offcanvas, InputGroup, FormControl, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import debounce from "lodash/debounce";
import { useSearchBar } from "../../context/searchBarContext";
import "./style/searchBar.css";
import s1 from "../../assets/s1.jpg";
import s2 from "../../assets/s2.jpg";
import s3 from "../../assets/s3.jpg";
import s4 from "../../assets/s4.jpg";

const SearchBar = () => {
  const { isOffCanvasOpen, closeSearchBar } = useSearchBar();

  // State để lưu toàn bộ sản phẩm và kết quả tìm kiếm
  const [allProducts, setAllProducts] = useState([]); // Lưu toàn bộ sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Kết quả tìm kiếm
  const [searchKey, setSearchKey] = useState(""); // Từ khóa tìm kiếm

  // Danh sách mặc định
  const trendingItems = [
    { image: s1, title: "Pre-fall 2024: The Icon", link: "/pre-fall-2024" },
    { image: s2, title: "Office Style: Oversize Bags", link: "/office-style" },
    { image: s3, title: "Autumn's Choice", link: "/autumn-choice" },
    { image: s4, title: "Best Seller", link: "/best-seller" },
  ];

  // Lấy tất cả sản phẩm từ server khi Offcanvas mở
  useEffect(() => {
    if (isOffCanvasOpen) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("http://localhost:8081/products");
          const products = Array.isArray(response.data.products)
            ? response.data.products
            : []; // Đảm bảo `products` là mảng
          setAllProducts(products);
          setFilteredProducts(products); // Hiển thị mặc định tất cả sản phẩm
        } catch (error) {
          console.error("Error fetching products:", error);
          setAllProducts([]); // Nếu lỗi, đặt giá trị mặc định
          setFilteredProducts([]); // Nếu lỗi, đặt giá trị mặc định
        }
      };

      fetchProducts();
    }
  }, [isOffCanvasOpen]);

  // Debounce để tối ưu khi lọc
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!Array.isArray(allProducts)) return; // Bảo vệ nếu `allProducts` không phải mảng

        if (value.trim() === "") {
          setFilteredProducts(allProducts); // Hiển thị tất cả nếu không nhập gì
        } else {
          const filtered = allProducts.filter((product) => {
            const name = product.translations?.find(
              (t) => t.language === "vi" || t.language === "en"
            )?.name;
            return name?.toLowerCase().includes(value.toLowerCase());
          });
          setFilteredProducts(filtered);
        }
      }, 300), // 300ms debounce
    [allProducts]
  );

  // Xử lý khi người dùng nhập từ khóa
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    debouncedSearch(value); // Thực hiện debounce
  };

  // Điều kiện kiểm tra chiều cao của Offcanvas
  const offcanvasHeightClass =
    searchKey.trim() === "" ? "" : "offcanvas-expanded";

  return (
    <Offcanvas
      show={isOffCanvasOpen}
      onHide={closeSearchBar}
      placement="top"
      className={`offcanvas-fullscreen ${offcanvasHeightClass}`}
    >
      <Offcanvas.Body className="mt-3">
        {/* Thanh tìm kiếm */}
        <InputGroup>
          <InputGroup.Text
            style={{
              background: "#F5F5F5",
              borderRight: "0",
              fontSize: "15px",
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </InputGroup.Text>
          <FormControl
            style={{ background: "#F5F5F5", borderLeft: "0" }}
            placeholder="Bạn muốn tìm gì hôm nay..."
            value={searchKey}
            onChange={handleSearchChange}
            aria-label="Search"
          />
        </InputGroup>

        {/* Hiển thị giao diện */}
        <Row className="mt-4">
          {searchKey.trim() === "" ? (
            // Giao diện mặc định
            <>
              {/* Cột Tìm kiếm phổ biến */}
              <Col xs={4}>
                <h5>Tìm kiếm phổ biến</h5>
                <ul
                  className="popular-search-list"
                  style={{ listStyle: "none" }}
                >
                  <li>Săn coupon 50K</li>
                  <li>Xu hướng hè thu 2024</li>
                  <li>Streetstyle</li>
                  <li>Giày túi công sở</li>
                  <li>Giày túi back to school</li>
                </ul>
              </Col>

              {/* Cột Xu hướng nổi bật */}
              <Col>
                <h5>Xu hướng nổi bật</h5>
                <Row>
                  {trendingItems.map((item, index) => (
                    <Col xs={3} key={index}>
                      <div
                        className="highlight-card"
                        onClick={() => (window.location.href = item.link)}
                        style={{
                          cursor: "pointer",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ padding: "4px", textAlign: "center" }}>
                          <p style={{ fontSize: "14px", margin: "0" }}>
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </>
          ) : (
            <Col>
              <h5>Kết quả tìm kiếm</h5>
              <Row>
                {Array.isArray(filteredProducts) &&
                filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const translation =
                      product.translations?.find(
                        (t) => t.language === "vi" || t.language === "en"
                      ) || product.translations?.[0];
                    return (
                      <Col xs={3} key={product.product_id}>
                        <div
                          className="highlight-card"
                          onClick={() =>
                            (window.location.href = `/product-id/${product.product_id}`)
                          }
                          style={{
                            cursor: "pointer",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid #ddd",
                          }}
                        >
                          <img
                            src={product.main_image_url || "/placeholder.jpg"}
                            alt={translation?.name || "Sản phẩm"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div style={{ padding: "4px", textAlign: "center" }}>
                            <p style={{ fontSize: "14px", margin: "0" }}>
                              {translation?.name || "Tên không xác định"}
                            </p>
                          </div>
                        </div>
                      </Col>
                    );
                  })
                ) : (
                  <p className="text-muted text-center mt-3">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                )}
              </Row>
            </Col>
          )}
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SearchBar;
