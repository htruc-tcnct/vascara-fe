import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container fluid>
      <h1 className="my-4">Admin Dashboard</h1>
      <Row>
        {/* Card 1 */}
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>120</h3>
            </Card.Body>
          </Card>
        </Col>
        {/* Card 2 */}
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Orders Today</Card.Title>
              <h3>34</h3>
            </Card.Body>
          </Card>
        </Col>
        {/* Card 3 */}
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Revenue</Card.Title>
              <h3>$4,560</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Recent Orders</Card.Title>
              <p>Order #1234 - Completed</p>
              <p>Order #1235 - Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Activity Logs</Card.Title>
              <p>User John updated profile</p>
              <p>Admin Jane added a product</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
