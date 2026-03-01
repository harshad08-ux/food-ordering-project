import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./MyOrders.css";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      fetchOrders(); // refresh list
  
    } catch (err) {
      alert("Cannot cancel this order");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="orders-page">
      <h2 className="orders-title">📦 My Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>

          <div className="order-header">
            <span>Order ID: {order._id.slice(-6)}</span>
            <span className={`status-badge ${order.status}`}>
              {order.status}
            </span>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <p key={index}>
                {item.food?.name} × {item.quantity}
              </p>
            ))}
          </div>

          <div className="order-footer">
            <strong>Total: ₹{order.totalPrice}</strong>
          </div>
          {order.status === "pending" && (
  <button
    className="cancel-btn"
    onClick={() => handleCancel(order._id)}
  >
    Cancel Order
  </button>
)}

          {/* STATUS TRACKER */}
          <div className="status-tracker">
            <div className={order.status !== "pending" ? "active" : ""}>
              Pending
            </div>
            <div className={
              order.status === "preparing" || order.status === "delivered"
                ? "active"
                : ""
            }>
              Preparing
            </div>
            <div className={
              order.status === "delivered" ? "active" : ""
            }>
              Delivered
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default MyOrders;