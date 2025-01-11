import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthEurope, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Form, Dropdown } from "react-bootstrap";

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false); // Quản lý trạng thái dropdown cho màn hình nhỏ
  const currentLanguage = i18n.language; // Lấy ngôn ngữ hiện tại

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleDropdownSelect = (lang) => {
    i18n.changeLanguage(lang);
    setShowDropdown(false); // Đóng dropdown sau khi chọn
  };

  return (
    <div className="d-flex align-items-center pt-2">
      {/* Màn hình lớn (lg trở lên): Hiển thị đầy đủ */}
      <div className="d-none d-lg-flex align-items-center">
        <FontAwesomeIcon
          icon={faEarthEurope}
          style={{
            fontSize: "20px",
            marginRight: "10px",
            color: "#212529",
          }}
        />
        <Form.Select
          aria-label="Select language"
          onChange={handleChange}
          value={currentLanguage} // Chọn ngôn ngữ hiện tại
          style={{
            width: "100px",
            fontSize: "11px",
          }}
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </Form.Select>
      </div>

      {/* Màn hình nhỏ (sm, xs): Chỉ hiển thị icon */}
      <div className="d-lg-none">
        <FontAwesomeIcon
          icon={faEarthEurope}
          style={{
            fontSize: "15px",
            color: "#212529",
            cursor: "pointer",
            marginBottom: "4px",
          }}
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {/* Dropdown hiển thị khi người dùng nhấn vào icon */}
        <Dropdown
          show={showDropdown}
          onToggle={() => setShowDropdown(!showDropdown)}
          align="start" // Điều chỉnh dropdown xuất hiện bên dưới
        >
          <Dropdown.Menu
            style={{
              minWidth: "100px",
              left: "-20px", // Điều chỉnh vị trí sang bên trái
            }}
          >
            <Dropdown.Item
              style={{ fontSize: "10px" }}
              onClick={() => handleDropdownSelect("en")}
            >
              {currentLanguage === "en" && (
                <FontAwesomeIcon icon={faCheck} className="me-2" />
              )}
              English
            </Dropdown.Item>
            <Dropdown.Item
              style={{ fontSize: "10px" }}
              onClick={() => handleDropdownSelect("vi")}
            >
              {currentLanguage === "vi" && (
                <FontAwesomeIcon icon={faCheck} className="me-2" />
              )}
              Tiếng Việt
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default LanguageSelector;
