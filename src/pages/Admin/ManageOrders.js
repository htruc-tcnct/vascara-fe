import React from "react";
import { Table, Container, Button } from "react-bootstrap";

const ManageOrders = () => {
  const orders = [
    { id: 1, customer: "John Doe", total: "$100", status: "Completed" },
    { id: 2, customer: "Jane Smith", total: "$200", status: "Pending" },
    { id: 3, customer: "Tom Hanks", total: "$150", status: "Cancelled" },
  ];

  return (
    <Container>
      <h1 className="my-4">Manage Orders</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">
                  View
                </Button>
                <Button variant="warning" size="sm">
                  Update Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageOrders;
