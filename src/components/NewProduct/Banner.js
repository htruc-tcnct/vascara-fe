import { Container } from "react-bootstrap";
import "../style/banner.css";
import { useTranslation } from "react-i18next";
import React from "react";
import Slider from "react-slick";
import lgMain from "../../assets/lg-main.jpg";
import smMain from "../../assets/sm-main.jpg";
import bn1 from "../../assets/banner1.jpg";
import bn2 from "../../assets/banner2.jpg";

function Banner() {
  const { t } = useTranslation(); // Hook để sử dụng bản dịch
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Kích hoạt chế độ tự động
    autoplaySpeed: 3000, // Tự động chuyển sau 3 giây (3000ms)
  };

  return (
    <Container fluid style={{ width: "100%" }}>
      <p
        style={{ color: "rgb(117, 117, 117)", fontSize: "0.8em" }}
        className="text-start "
      >
        {t("banner.homepage_title")}
      </p>{" "}
      <div className="d-lg-block d-none">
        <img style={{ width: "100%" }} src={lgMain} alt="Banner" />
      </div>
      <div className="d-lg-none d-block">
        <img style={{ width: "100%" }} src={smMain} alt="Banner" />
      </div>
      <Slider {...settings}>
        <img
          style={{ objectFit: "contain", width: "100%" }}
          src={bn1}
          alt="1"
        />
        <img
          style={{ objectFit: "contain", width: "100%" }}
          src={bn2}
          alt="2"
        />
      </Slider>
    </Container>
  );
}

export default Banner;
