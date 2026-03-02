import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRestaurant();
    }
  }, [user?.token]);

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  if (!restaurant) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No restaurant found</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>🏪 Owner Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Restaurant Card */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2>{restaurant.name}</h2>
        <p>{restaurant.address}</p>
        <p>Cuisine: {restaurant.cuisine}</p>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() =>
              navigate(`/owner/menu/${restaurant._id}`)
            }
            style={{ marginRight: "10px" }}
          >
            Manage Menu
          </button>

          <button onClick={() => navigate("/owner/orders")}>
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;