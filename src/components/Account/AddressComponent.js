import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Form,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
function AddressComponent() {
  const [address, setAddress] = useState([]); // Address list
  const [selectedAddresses, setSelectedAddresses] = useState([]); // Selected addresses
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [newAddress, setNewAddress] = useState({
    province_code: "",
    district_code: "",
    ward_code: "",
    specific_address: "",
  });
  const [isEditing, setIsEditing] = useState(null); // Track editing state
  const [showModal, setShowModal] = useState(false); // Modal toggle
  const token = localStorage.getItem("token");

  // Fetch all addresses
  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/address/get-address`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddress(response.data.data.address || []); // Populate address list
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  };

  // Fetch all provinces
  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_MAP_VN}/p`);
      setProvinces(response.data || []);
    } catch (error) {
      console.error("Failed to fetch provinces:", error);
    }
  };

  // Fetch districts based on selected province
  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_MAP_VN}/d/province/${provinceCode}`
      );
      setDistricts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  // Fetch wards based on selected district
  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_MAP_VN}/w/district/${districtCode}`
      );
      setWards(response.data || []);
    } catch (error) {
      console.error("Failed to fetch wards:", error);
    }
  };

  useEffect(() => {
    fetchAddress(); // Load address list on mount
    fetchProvinces(); // Load provinces on mount
  }, []);

  // Open modal for create or update
  const handleOpenModal = (address = null) => {
    setShowModal(true);
    if (address) {
      setIsEditing(address.address_id);
      setNewAddress({
        province_code: address.province_code,
        district_code: address.district_code,
        ward_code: address.ward_code,
        specific_address: address.specific_address,
      });
      fetchDistricts(address.province_code);
      fetchWards(address.district_code);
    } else {
      setIsEditing(null);
      setNewAddress({
        province_code: "",
        district_code: "",
        ward_code: "",
        specific_address: "",
      });
    }
  };

  // Handle create or update address
  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/address/update/${isEditing}`,
          newAddress,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Address updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/address/`,
          newAddress,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Address created successfully!");
      }
      setShowModal(false); // Close modal
      setNewAddress({
        province_code: "",
        district_code: "",
        ward_code: "",
        specific_address: "",
      }); // Reset form
      setIsEditing(null);
      fetchAddress(); // Refresh the list
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  // Handle delete single address
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/address/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Address deleted successfully!");
      fetchAddress(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  // Handle delete selected addresses
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedAddresses.map((id) =>
          axios.delete(
            `${process.env.REACT_APP_SERVER_URL}/address/delete/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
      alert("Selected addresses deleted successfully!");
      setSelectedAddresses([]);
      fetchAddress(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete addresses:", error);
    }
  };

  // Toggle address selection
  const toggleAddressSelection = (id) => {
    setSelectedAddresses((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  return (
    <Container>
      <h2>Address Management</h2>
      <div className="mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="info">
            Actions <FontAwesomeIcon icon={faArrowDown} className="me-2" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleOpenModal()}>
              Create New
            </Dropdown.Item>
            {selectedAddresses.length === 1 && (
              <Dropdown.Item
                onClick={() =>
                  handleOpenModal(
                    address.find(
                      (addr) => addr.address_id === selectedAddresses[0]
                    )
                  )
                }
              >
                Update
              </Dropdown.Item>
            )}
            {selectedAddresses.length > 0 && (
              <Dropdown.Item onClick={handleDeleteSelected}>
                Delete Selected
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Address Table */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSelectedAddresses(
                    checked ? address.map((addr) => addr.address_id) : []
                  );
                }}
                checked={
                  selectedAddresses.length === address.length &&
                  address.length > 0
                }
              />
            </th>
            <th>#</th>
            <th>Province</th>
            <th>District</th>
            <th>Ward</th>
            <th>Specific Address</th>
          </tr>
        </thead>
        <tbody>
          {address.length > 0 ? (
            address.map((addr, index) => (
              <tr key={addr.address_id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedAddresses.includes(addr.address_id)}
                    onChange={() => toggleAddressSelection(addr.address_id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{addr.province_name}</td>
                <td>{addr.district_name}</td>
                <td>{addr.ward_name}</td>
                <td>{addr.specific_address}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No address data available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Create/Update */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Update Address" : "Create New Address"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="province">
              <Form.Label>Province</Form.Label>
              <Form.Select
                value={newAddress.province_code}
                onChange={(e) => {
                  const selectedProvince = e.target.value;
                  setNewAddress({
                    ...newAddress,
                    province_code: selectedProvince,
                    district_code: "",
                    ward_code: "",
                  });
                  fetchDistricts(selectedProvince); // Load districts
                }}
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="district">
              <Form.Label>District</Form.Label>
              <Form.Select
                value={newAddress.district_code}
                onChange={(e) => {
                  const selectedDistrict = e.target.value;
                  setNewAddress({
                    ...newAddress,
                    district_code: selectedDistrict,
                    ward_code: "",
                  });
                  fetchWards(selectedDistrict); // Load wards
                }}
                disabled={!newAddress.province_code}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="ward">
              <Form.Label>Ward</Form.Label>
              <Form.Select
                value={newAddress.ward_code}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, ward_code: e.target.value })
                }
                disabled={!newAddress.district_code}
              >
                <option value="">Select Ward</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="specificAddress">
              <Form.Label>Specific Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter specific address"
                value={newAddress.specific_address}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    specific_address: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update Address" : "Create Address"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddressComponent;
