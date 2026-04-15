import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "chart.js/auto";
import "./OwnerDashboard.css";

const socket = io("http://localhost:5000");

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [restaurantImage, setRestaurantImage] = useState(null);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [topFoods, setTopFoods] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchRestaurant();

  socket.on("new_order", (order) => {
    toast.success(`🔔 New Order Received! ₹${order.totalPrice}`);
    fetchStats();
    fetchWeeklyRevenue();
    fetchTopFoods();
  });

  return () => {
    socket.off("new_order");
  };
}, []);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/restaurants/owner/my",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setRestaurant(res.data);

      fetchStats();
      fetchWeeklyRevenue();
      fetchTopFoods();
    } catch (err) {
      navigate("/owner/create-restaurant", { replace: true });
    }
  };

  const handleRestaurantImageUpdate = async () => {
    if (!restaurantImage) {
      alert("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", restaurantImage);

      await axios.put(
        `http://localhost:5000/api/restaurants/${restaurant._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("✅ Restaurant image updated");
      setRestaurantImage(null);
      fetchRestaurant();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update image");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/owner/stats",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWeeklyRevenue = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/owner/weekly-revenue",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setWeeklyRevenue(Object.values(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTopFoods = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/owner/top-foods",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTopFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const performanceChart = {
    labels: ["Orders", "Revenue"],
    datasets: [
      {
        label: "Restaurant Performance",
        data: [stats.totalOrders, stats.totalRevenue],
        backgroundColor: ["#ff6b00", "#4caf50"],
      },
    ],
  };

  const weeklyChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Revenue",
        data: weeklyRevenue,
        backgroundColor: "#ff6b00",
      },
    ],
  };

  const topFoodChart = {
    labels: topFoods.map((f) => f.name),
    datasets: [
      {
        label: "Top Selling Foods",
        data: topFoods.map((f) => f.total),
        backgroundColor: "#ff6b00",
      },
    ],
  };

  return (
    <div className="owner-dashboard">
      <div className="owner-navbar">
        <h2>🍔 Owner Panel</h2>

        <div className="nav-buttons">
          <button onClick={() => navigate("/owner/menu")}>Menu</button>
          <button onClick={() => navigate("/owner/orders")}>Orders</button>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <h1 className="dashboard-title">📊 Restaurant Dashboard</h1>

      {/* 🖼 Restaurant Image Update */}
      {restaurant && (
        <div className="restaurant-image-section">
          {restaurant.image && (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-preview"
            />
          )}
                
        <div className="restaurant-upload-controls">
          <h3>🖼 Restaurant Image</h3>
      
          <input
            type="file"
            accept="image/*"
            className="restaurant-file-input"
            onChange={(e) => setRestaurantImage(e.target.files[0])}
          />
      
          <button
            className="update-image-btn"
            onClick={handleRestaurantImageUpdate}
          >
            Update Image
          </button>
        </div>
      </div>
      )}

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

      <div className="charts-grid">
        <div className="chart-container">
          <h3>📈 Performance Overview</h3>
          <Bar data={performanceChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div className="chart-container">
          <h3>📅 Weekly Revenue</h3>
          <Bar data={weeklyChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div className="chart-container">
          <h3>🔥 Top Selling Foods</h3>
          <Bar data={topFoodChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OwnerDashboard;