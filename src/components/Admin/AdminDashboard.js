import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link to="/admin/manage-users">Manage Users</Link>
        </li>
        <li>
          <Link to="/admin/manage-products">Manage Products</Link>
        </li>
        <li>
          <Link to="/admin/manage-orders">Manage Orders</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboard;
