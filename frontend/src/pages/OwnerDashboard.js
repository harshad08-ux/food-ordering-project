import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/orders/owner/stats",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="owner-dashboard">

      {/* 🔥 NAVBAR */}
      <div className="owner-navbar">

        <h2>🍔 Owner Panel</h2>

        <div className="nav-buttons">

          <button onClick={() => navigate("/owner/menu")}>
            Menu
          </button>

          <button onClick={() => navigate("/owner/orders")}>
            Orders
          </button>

          <button className="logout" onClick={logout}>
            Logout
          </button>

        </div>

      </div>

      <h1>📊 Restaurant Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="card revenue">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>

      </div>

    </div>
  );
};

export default OwnerDashboard;