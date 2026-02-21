import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          food: item._id,
          quantity: item.quantity
        })),
        totalPrice: totalAmount
      };

      await createOrder(orderData);
      alert("Order placed successfully 🎉");
      clearCart();
      navigate("/my-orders");
    } catch {
      alert("Failed to place order");
    }
  };

  return (
    <div className="cart-container">
      {/* 🔙 HEADER */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <button onClick={() => navigate("/home")}>🏠 Home</button>
      </div>

      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div className="cart-item" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <p>₹{item.price} × {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ₹{totalAmount}</h3>

          <button className="checkout-btn" onClick={handleCheckout}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
