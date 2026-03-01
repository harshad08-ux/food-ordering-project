import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders",
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-orders-page">
      <h2 className="admin-title">📋 Manage Orders</h2>

      {orders.map((order) => (
        <div className="admin-order-card" key={order._id}>

          <div className="admin-order-header">
            <div>
              <strong>Order ID:</strong> {order._id.slice(-6)}
              <p className="customer-email">
                {order.user?.email}
              </p>
            </div>

            <span className={`status-badge ${order.status}`}>
              {order.status}
            </span>
          </div>

          <div className="admin-order-items">
            {order.items.map((item, index) => (
              <p key={index}>
                {item.food?.name} × {item.quantity}
              </p>
            ))}
          </div>

          <div className="admin-order-footer">
            <strong>Total: ₹{order.totalPrice}</strong>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

        </div>
      ))}
    </div>
  );
};

export default AdminOrders;