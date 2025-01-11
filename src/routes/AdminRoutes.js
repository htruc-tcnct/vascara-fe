import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import ManageUsers from "../pages/Admin/ManageUsers";
import ManageOrders from "../pages/Admin/ManageOrders";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-orders" element={<ManageOrders />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
