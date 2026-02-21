import { useEffect, useState } from "react";
import { myOrders } from "../api/orders";
import { useNavigate } from "react-router-dom";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    myOrders()
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading orders...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔙 HEADER */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <button onClick={() => navigate("/home")}>🏠 Home</button>
      </div>

      <h2>My Orders 🧾</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <p><b>Order ID:</b> {order._id.slice(-6)}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total:</b> ₹{order.totalPrice}</p>

          <ul>
            {order.items.map((item, i) => (
              <li key={i}>
                {item.food?.name || "Food"} × {item.quantity}
              </li>
            ))}
          </ul>

          <OrderStatusTimeline status={order.status} />
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
