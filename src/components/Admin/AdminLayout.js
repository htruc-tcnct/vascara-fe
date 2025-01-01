import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{ width: "250px", backgroundColor: "#f4f4f4", padding: "20px" }}
      >
        <p>[Sidebar Placeholder]</p>
        <ul>
          <li>
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/admin/manage-users">Manage Users</a>
          </li>
          <li>
            <a href="/admin/manage-orders">Manage Orders</a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children} {/* Render nội dung các route */}
      </div>
    </div>
  );
};

export default AdminLayout;
