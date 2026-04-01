import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./MyOrders.css";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const [showReview, setShowReview] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

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

  // ✅ CANCEL ORDER
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

      fetchOrders();

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Cannot cancel this order"
      );
    }
  };

  // ⭐ OPEN REVIEW
  const openReview = (foodId) => {
    if (!foodId) return;

    setSelectedFood(foodId);
    setShowReview(true);
  };

  // ⭐ SUBMIT REVIEW
  const submitReview = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          foodId: selectedFood,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Review submitted!");

      setShowReview(false);
      setRating(0);
      setComment("");

    } catch (err) {
      console.log(err);
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

          {/* ITEMS */}
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <p>
                  {item.food?.name || "Food unavailable"} ×{" "}
                  {item.quantity}
                </p>

                {order.status === "delivered" &&
                  item.food && (
                    <button
                      className="rate-btn"
                      onClick={() =>
                        openReview(item.food._id)
                      }
                    >
                      ⭐ Rate
                    </button>
                  )}
              </div>
            ))}
          </div>

          <div className="order-footer">
            <strong>Total: ₹{order.totalPrice}</strong>
          </div>

          {/* CANCEL BUTTON */}
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
            <div
              className={
                [
                  "accepted",
                  "preparing",
                  "out_for_delivery",
                  "delivered",
                ].includes(order.status)
                  ? "active"
                  : ""
              }
            >
              Pending
            </div>

            <div
              className={
                [
                  "preparing",
                  "out_for_delivery",
                  "delivered",
                ].includes(order.status)
                  ? "active"
                  : ""
              }
            >
              Preparing
            </div>

            <div
              className={
                order.status === "delivered"
                  ? "active"
                  : ""
              }
            >
              Delivered
            </div>
          </div>
        </div>
      ))}

      {/* ⭐ REVIEW POPUP */}
      {showReview && (
        <div className="review-overlay">
          <div className="review-modal">
            <h3>⭐ Rate this food</h3>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating
                      ? "active-star"
                      : ""
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write review..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
            />

            <div className="review-actions">
              <button onClick={submitReview}>
                Submit Review
              </button>

              <button
                className="cancel-review"
                onClick={() =>
                  setShowReview(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;