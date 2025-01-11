import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "../style/banner.css"; // CSS tuỳ chỉnh

import bn1 from "../../assets/bn1.png";
import bn2 from "../../assets/bn2.jpg";
import bn3 from "../../assets/bn3.png";
import bn4 from "../../assets/bn4.png";
import giay from "../../assets/giay.jpg";
import tui from "../../assets/tui.jpg";
import vi from "../../assets/ví.jpg";
import spotlight1 from "../../assets/spot1.jpg";
import spotlight2 from "../../assets/spot2.jpg";
import spotlight3 from "../../assets/spot3.jpg";
import spotlight4 from "../../assets/spot4.jpg";

function Banner() {
  const { t } = useTranslation();

  // Cài đặt cho slider chính
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  // Cài đặt cho slider Spotlight
  const settingsSpotlight = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Container fluid className="custom-container">
      {/* Slider chính */}
      <div className="main-slider">
        <Slider {...settings}>
          <img
            style={{ objectFit: "contain", width: "100%" }}
            src={bn1}
            alt="Banner 1"
          />
          <img
            style={{ objectFit: "contain", width: "100%" }}
            src={bn2}
            alt="Banner 2"
          />
          <img
            style={{ objectFit: "contain", width: "100%" }}
            src={bn3}
            alt="Banner 3"
          />
          <img
            style={{ objectFit: "contain", width: "100%" }}
            src={bn4}
            alt="Banner 4"
          />
        </Slider>
      </div>

      {/* Bộ sưu tập */}
      <div className="mt-5 px-3">
        <Row>
          <Col md={4} className="text-center">
            <img
              src={tui}
              alt="Túi"
              style={{ width: "100%", objectFit: "cover" }}
            />
            <h5 className="mt-3">{t("home.bag-collections")}</h5>
            <a
              href="/bag?filter=all"
              style={{ color: "#25282B", textDecoration: "underline" }}
            >
              {t("home.go-to-see")}
            </a>
          </Col>
          <Col md={4} className="text-center">
            <img
              src={giay}
              alt="Giày"
              style={{ width: "100%", objectFit: "cover" }}
            />
            <h5 className="mt-3">{t("home.shoe-collections")}</h5>
            <a
              href="/sandal?category_id=3&filter=all"
              style={{ color: "#25282B", textDecoration: "underline" }}
            >
              {t("home.go-to-see")}
            </a>
          </Col>
          <Col md={4} className="text-center">
            <img
              src={vi}
              alt="Ví"
              style={{ width: "100%", objectFit: "cover" }}
            />
            <h5 className="mt-3">{t("home.wallet-collections")}</h5>
            <a
              href="/wallet?category_id=2&filter=all"
              style={{ color: "#25282B", textDecoration: "underline" }}
            >
              {t("home.go-to-see")}
            </a>
          </Col>
        </Row>
      </div>

      {/* Spotlight */}
      <div className="mt-5 text-center">
        <h3>Vascara Spotlight</h3>
        <p className="text-muted">{t("home.slogans")}</p>
        <Slider {...settingsSpotlight}>
          <div>
            <img
              src={spotlight1}
              alt="Spotlight 1"
              style={{ width: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={spotlight2}
              alt="Spotlight 2"
              style={{ width: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={spotlight3}
              alt="Spotlight 3"
              style={{ width: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={spotlight4}
              alt="Spotlight 4"
              style={{ width: "100%", objectFit: "cover" }}
            />
          </div>
        </Slider>
      </div>
    </Container>
  );
}

export default Banner;
