import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ ADD THIS
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    delivered: 0,
  });

  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ USE CONTEXT
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data;

      setStats({
        total: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        preparing: orders.filter(o => o.status === "preparing").length,
        delivered: orders.filter(o => o.status === "delivered").length,
      });
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats", error);
    }
  };

  // ✅ FIXED LOGOUT (IMPORTANT)
  const handleLogout = () => {
    logout();                 // clears context + localStorage
    navigate("/login", { replace: true }); // clean redirect
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="stat-card preparing">
          <h3>Preparing</h3>
          <p>{stats.preparing}</p>
        </div>

        <div className="stat-card delivered">
          <h3>Delivered</h3>
          <p>{stats.delivered}</p>
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={() => navigate("/admin/orders")}>
          Manage Orders →
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
