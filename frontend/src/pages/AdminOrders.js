import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h2>Manage Orders</h2>
        <Link to="/admin/dashboard">
          <button>← Back to Dashboard</button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>

                  <td>{order.user?.email || "User"}</td>

                  <td>
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        {item.food?.name} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td>₹{order.totalPrice}</td>

                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
