import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OwnerOrders.css";

const OwnerOrders = () => {

  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/orders/owner/my",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setOrders(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {

    try {

      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      fetchOrders();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="owner-orders">

      <h1>📦 Restaurant Orders</h1>

      {orders.map((order) => (

        <div className="order-card" key={order._id}>

          <div className="order-header">
            <h3>Order #{order._id.slice(-6)}</h3>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>

          <p className="customer">
            Customer: {order.user?.email}
          </p>

          <div className="items">
            {order.items.map((item, i) => (
              <p key={i}>
                {item.food?.name} × {item.quantity}
              </p>
            ))}
          </div>

          <p className="price">
            Total: ₹{order.totalPrice}
          </p>

          <p className="time">
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <div className="actions">

  <button
    onClick={() => updateStatus(order._id, "accepted")}
    disabled={order.status !== "pending"}
  >
    Accept
  </button>

  <button
    onClick={() => updateStatus(order._id, "preparing")}
    disabled={order.status !== "accepted"}
  >
    Preparing
  </button>

  <button
    onClick={() => updateStatus(order._id, "out_for_delivery")}
    disabled={order.status !== "preparing"}
  >
    Out for Delivery
  </button>

  <button
    onClick={() => updateStatus(order._id, "delivered")}
    disabled={order.status !== "out_for_delivery"}
  >
    Delivered
  </button>

</div>

        </div>

      ))}

    </div>
  );
};

export default OwnerOrders;