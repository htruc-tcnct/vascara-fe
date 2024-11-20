import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function AddressFormModal({ show, onHide, onSubmit }) {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch Tỉnh/Thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/p/"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch tỉnh/thành phố:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Quận/Huyện khi tỉnh/thành phố được chọn
  useEffect(() => {
    if (address.province) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${address.province}?depth=2`
          );
          setDistricts(response.data.districts || []);
          setWards([]); // Reset Phường/Xã khi Tỉnh/Thành phố thay đổi
        } catch (error) {
          console.error("Lỗi khi fetch quận/huyện:", error);
        }
      };
      fetchDistricts();
    }
  }, [address.province]);

  // Fetch Phường/Xã khi Quận/Huyện được chọn
  useEffect(() => {
    if (address.district) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/d/${address.district}?depth=2`
          );
          setWards(response.data.wards || []);
        } catch (error) {
          console.error("Lỗi khi fetch phường/xã:", error);
        }
      };
      fetchWards();
    }
  }, [address.district]);

  // Hàm xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  // Hàm xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(address); // Gọi callback khi gửi form
    onHide(); // Đóng modal
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm địa chỉ mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Họ và tên:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Vd: Nguyễn Văn A"
              name="name"
              value={address.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Số điện thoại */}
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Số điện thoại:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Vd: 0123456789"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Tỉnh/Thành phố */}
          <Form.Group className="mb-3" controlId="formProvince">
            <Form.Label>Tỉnh / Thành phố:</Form.Label>
            <Form.Select
              name="province"
              value={address.province}
              onChange={handleChange}
              required
            >
              <option value="">Chọn Tỉnh / Thành phố</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Quận/Huyện */}
          <Form.Group className="mb-3" controlId="formDistrict">
            <Form.Label>Quận / Huyện:</Form.Label>
            <Form.Select
              name="district"
              value={address.district}
              onChange={handleChange}
              required
              disabled={!address.province}
            >
              <option value="">Chọn Quận / Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Phường/Xã */}
          <Form.Group className="mb-3" controlId="formWard">
            <Form.Label>Phường / Xã:</Form.Label>
            <Form.Select
              name="ward"
              value={address.ward}
              onChange={handleChange}
              required
              disabled={!address.district}
            >
              <option value="">Chọn Phường / Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onHide}>
              Trở lại
            </Button>
            <Button variant="dark" type="submit">
              Thêm địa chỉ
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddressFormModal;
