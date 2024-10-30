import React from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import "./style/footer.css";

function Footer() {
  const { t } = useTranslation(); // Hook để sử dụng bản dịch

  return (
    <footer className="bg-light mt-5">
      <hr />

      <Container fluid>
        <Row>
          {/* Dùng Accordion cho màn hình nhỏ */}
          <Col xs={12} className="d-block d-md-none">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>{t("connect")}</Accordion.Header>
                <Accordion.Body>
                  <p>{t("hotline")}</p>
                  <div className="d-flex">
                    <a href="#" className="text-dark me-3">
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a href="#" className="text-dark me-3">
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="#" className="text-dark me-3">
                      <FontAwesomeIcon icon={faTiktok} />
                    </a>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Mua sắm */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>{t("shopping")}</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled">
                    <li>
                      <a href="#promotion">{t("promotion")}</a>
                    </li>
                    <li>
                      <a href="#new_products">{t("new_products")}</a>
                    </li>
                    <li>
                      <a href="#guide">{t("guide")}</a>
                    </li>
                    <li>
                      <a href="#size_guide">{t("size_guide")}</a>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* Hỗ trợ */}
              <Accordion.Item eventKey="2">
                <Accordion.Header>{t("support")}</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled">
                    <li>
                      <a href="#customer_policy">{t("customer_policy")}</a>
                    </li>
                    <li>
                      <a href="#warranty_policy">{t("warranty_policy")}</a>
                    </li>
                    <li>
                      <a href="#shipping_policy">{t("shipping_policy")}</a>
                    </li>
                    <li>
                      <a href="#return_policy">{t("return_policy")}</a>
                    </li>
                    <li>
                      <a href="#privacy_policy">{t("privacy_policy")}</a>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* Về Vascara */}
              <Accordion.Item eventKey="3">
                <Accordion.Header>{t("about_us")}</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled">
                    <li>
                      <a href="#about_vascara">{t("about_vascara")}</a>
                    </li>
                    <li>
                      <a href="#store_list">{t("store_list")}</a>
                    </li>
                    <li>
                      <a href="#recruitment">{t("recruitment")}</a>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>

          {/* Màn hình lớn không dùng Accordion */}
          <Col md={3} className="d-none d-md-block mb-3">
            <h6>{t("shopping")}</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#promotion">{t("promotion")}</a>
              </li>
              <li>
                <a href="#new_products">{t("new_products")}</a>
              </li>
              <li>
                <a href="#guide">{t("guide")}</a>
              </li>
              <li>
                <a href="#size_guide">{t("size_guide")}</a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="d-none d-md-block mb-3">
            <h6>{t("support")}</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#customer_policy">{t("customer_policy")}</a>
              </li>
              <li>
                <a href="#warranty_policy">{t("warranty_policy")}</a>
              </li>
              <li>
                <a href="#shipping_policy">{t("shipping_policy")}</a>
              </li>
              <li>
                <a href="#return_policy">{t("return_policy")}</a>
              </li>
              <li>
                <a href="#privacy_policy">{t("privacy_policy")}</a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="d-none d-md-block mb-3">
            <h6>{t("about_us")}</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#about_vascara">{t("about_vascara")}</a>
              </li>
              <li>
                <a href="#store_list">{t("store_list")}</a>
              </li>
              <li>
                <a href="#recruitment">{t("recruitment")}</a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="d-none d-md-block mb-3 px-4">
            <h6>{t("connect")}</h6>
            <p>{t("hotline")}</p>
            <div className="d-flex">
              <a href="#" className="text-dark me-3">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="text-dark me-3">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-dark me-3">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <hr />
    </footer>
  );
}

export default Footer;
