import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="success-page">
      <div className="success-card">

        <div className="checkmark">✓</div>
        <h2>Order Confirmed 🎉</h2>
        <p>Your rider is on the way!</p>

        {/* MAP SIMULATION */}
        <div className="map-container">
          <div className="road">
            <div
              className="delivery-bike"
              style={{ left: `${progress}%` }}
            >
              🛵
            </div>
          </div>

          <div className="map-labels">
            <span>🏬 Restaurant</span>
            <span>🏠 You</span>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/my-orders")}
        >
          View My Orders
        </button>

      </div>
    </div>
  );
};

export default OrderSuccess;