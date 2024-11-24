import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useUserInfo } from "../../context/UserInfoContext";
function EditProfileComponent() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWards, setSelectedWards] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [phoneError, setPhoneError] = useState("");
  const UserId = localStorage.getItem("idUser");
  const token = localStorage.getItem("token");
  const [detailAddress, setDetailAddress] = useState("");

  const { t } = useTranslation();
  // Function to safely parse JSON
  const safeParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  };

  // Fetch all provinces initially
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Fetch districts and province name when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          setDistricts(data.districts || []);
          setProvinceName(data.name);
        })
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedProvince]);

  // Fetch wards and district name when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          setWards(data.wards || []);
          setDistrictName(data.name);
        })
        .catch((error) => console.error("Error fetching wards:", error));
    }
  }, [selectedDistrict]);

  // Fetch ward name when a ward is selected
  useEffect(() => {
    if (selectedWards) {
      fetch(`https://provinces.open-api.vn/api/w/${selectedWards}`)
        .then((response) => response.json())
        .then((data) => setWardName(data.name))
        .catch((error) => console.error("Error fetching ward name:", error));
    }
  }, [selectedWards]);

  const getUserInfo = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/id/${UserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = result.data.user;
      setUserInfo(userData);

      // Parse address if it's a valid JSON string
      const addressFull = userData.address[0];
      console.log("FULL: ", addressFull);
      setSelectedProvince(addressFull.province);
      setSelectedDistrict(addressFull.district);
      setSelectedWards(addressFull.ward);
      setDetailAddress(addressFull.specific_address);
      // Fetch and set the names based on the user's address
      fetch(`https://provinces.open-api.vn/api/p/${addressFull.province}`)
        .then((response) => response.json())
        .then((data) => setProvinceName(data.name))
        .catch((error) =>
          console.error("Error fetching province name:", error)
        );

      fetch(`https://provinces.open-api.vn/api/d/${addressFull.district}`)
        .then((response) => response.json())
        .then((data) => setDistrictName(data.name))
        .catch((error) =>
          console.error("Error fetching district name:", error)
        );

      fetch(`https://provinces.open-api.vn/api/w/${addressFull.ward}`)
        .then((response) => response.json())
        .then((data) => setWardName(data.name))
        .catch((error) => console.error("Error fetching ward name:", error));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setUserInfo({ ...userInfo, phonenumber: value });

    if (!validatePhoneNumber(value)) {
      setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
    } else {
      setPhoneError("");
    }
  };

  const updateInfo = async () => {
    if (!validatePhoneNumber(userInfo.phonenumber)) {
      setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/update/${UserId}`,
        {
          ...userInfo,
          provinceCode: selectedProvince,
          districtCode: selectedDistrict,
          wardCode: selectedWards,
          addressDetail: detailAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cập nhật thành công:", response.data);
      alert("Thông tin cập nhật thành công");
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Đã xảy ra lỗi trong quá trình cập nhật. Vui lòng thử lại.");
    }
  };

  return (
    <Container fluid className="my-4 responsive-text">
      <h4>{t("profile.personal-info")}</h4>
      <Form style={{ position: "relative" }}>
        <Form.Group className="mb-3 responsive-text" controlId="formName">
          <Form.Label>{t("profile.full-name")}</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Nguyễn Hữu Trực"
            value={userInfo.name || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formPhone">
          <Form.Label>{t("profile.phone-number")}</Form.Label>
          <Form.Control
            type="text"
            name="phonenumber"
            placeholder="0393976624"
            value={userInfo.phonenumber || ""}
            onChange={handlePhoneChange}
            className={phoneError ? "error-border" : ""}
          />
          {phoneError && <div className="text-danger mt-1">{phoneError}</div>}
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="VD: abs@gmail.com"
            value={userInfo.email || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formDob">
          <Form.Label>{t("profile.birth")}</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            placeholder="Chọn ngày sinh"
            value={userInfo.birthday || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formCity">
          <Form.Label>{t("profile.province")}</Form.Label>
          <Form.Select
            value={selectedProvince}
            onChange={(e) => {
              const newProvinceCode = e.target.value;
              setSelectedProvince(newProvinceCode);
              setSelectedDistrict("");
              setSelectedWards("");
              setDistricts([]);
              setWards([]);
            }}
          >
            <option>{t("profile.pick-province")}</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formDistrict">
          <Form.Label>{t("profile.distict")}</Form.Label>
          <Form.Select
            value={selectedDistrict}
            onChange={(e) => {
              const newDistrictCode = e.target.value;
              setSelectedDistrict(newDistrictCode);
              setSelectedWards("");
              setWards([]);
            }}
            disabled={!selectedProvince}
          >
            <option>{t("profile.pick-distict")}</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formWard">
          <Form.Label>{t("profile.ward")}</Form.Label>
          <Form.Select
            value={selectedWards}
            onChange={(e) => setSelectedWards(e.target.value)}
            disabled={!selectedDistrict}
          >
            <option>{t("profile.pick-ward")}</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 responsive-text" controlId="formAddress">
          <Form.Label>{t("profile.address")}</Form.Label>
          <Form.Control
            type="text"
            name="address"
            placeholder="VD: 96 Cao Thắng"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="dark"
          className="responsive-text"
          style={{ width: "30%" }}
          onClick={(e) => {
            e.preventDefault();
            updateInfo();
          }}
        >
          {t("profile.update")}
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfileComponent;
