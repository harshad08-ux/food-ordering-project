import React from "react";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Panel</h1>

      {/* Dashboard section */}
      <AdminDashboard />

      <hr />

      {/* Orders section */}
      <AdminOrders />
    </div>
  );
};

export default AdminPage;