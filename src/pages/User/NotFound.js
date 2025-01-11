import React from "react";
import { Link } from "react-router-dom";
import "./style/NotFound.css"; // Đảm bảo tạo file CSS này

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-text">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="back-home-button">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
