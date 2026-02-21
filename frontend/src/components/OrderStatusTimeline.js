import React from "react";
import "./OrderStatusTimeline.css";

const OrderStatusTimeline = ({ status }) => {
  const steps = ["pending", "preparing", "delivered"];

  return (
    <div className="timeline">
      {steps.map((step) => (
        <div
          key={step}
          className={`timeline-badge ${
            status === step || steps.indexOf(status) > steps.indexOf(step)
              ? "active"
              : ""
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTimeline;
