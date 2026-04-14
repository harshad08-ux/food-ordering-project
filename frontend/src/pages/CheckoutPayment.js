import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51TKhNLFIDfjQMsPdReQpAh6cGh9GtWZoEd5jg9IVLicVJ3b8Geplnh7xMnNUxnP5B1c6zxBfGqSeIPj2jkZsFEkL00vuJN5QlK"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/order-success",
      },
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
      return;
    }

    const safeTotal =
      Number(totalAmount) > 0 ? Number(totalAmount) : 50;

    const orderData = {
      items: cart.map((item) => ({
        food: item._id,
        quantity: item.quantity,
      })),
      totalPrice: safeTotal,
    };

    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(orderData),
    });

    clearCart();
    navigate("/order-success");
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <h2>💳 Complete Payment</h2>

      <PaymentElement />

      <button
        onClick={handlePayment}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          background: "#ff7a18",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Pay ₹{Number(totalAmount) > 0 ? totalAmount : 50}
      </button>
    </div>
  );
};

const CheckoutPayment = () => {
  const { totalAmount } = useCart();
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createIntent = async () => {
      const safeAmount =
        Number(totalAmount) > 0 ? Number(totalAmount) : 50;

      const res = await fetch(
        "http://localhost:5000/api/orders/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            amount: safeAmount,
          }),
        }
      );

      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    createIntent();
  }, [totalAmount, user]);

  if (!clientSecret) return <p>Loading payment...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPayment;