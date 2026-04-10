import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalAmount,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout-payment");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty 🛒</h2>
        <button onClick={() => navigate("/home")}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cart.map((item) => (
        <div className="cart-card" key={item._id}>
          <img
            src={
              item.image ||
              "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3"
            }
            alt={item.name}
          />

          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            <div className="qty-controller">
              <button
                onClick={() =>
                  updateQuantity(item._id, item.quantity - 1)
                }
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item._id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
          </div>

          <button
            className="remove-btn"
            onClick={() => removeFromCart(item._id)}
          >
            ✕
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Total: ₹{totalAmount}</h3>

        <button
          className="place-order-btn"
          onClick={handleCheckout}
        >
          Proceed to Payment 💳
        </button>
      </div>
    </div>
  );
};

export default Cart;