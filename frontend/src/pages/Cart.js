import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalAmount,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🛒 PLACE ORDER
  const handlePlaceOrder = async () => {
    try {
      if (!user?.token) {
        alert("Please login first");
        return;
      }

      const orderData = {
        items: cart.map((item) => ({
          food: item._id,
          quantity: item.quantity,
        })),
        totalPrice: totalAmount,
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Order failed");
      }

      alert("Order placed successfully 🎉");

      clearCart();
      navigate("/order-success");

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  // 🛒 EMPTY CART
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

          {/* IMAGE */}
          <img
            src={
              item.image ||
              "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3"
            }
            alt={item.name}
          />

          {/* INFO */}
          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            {/* QUANTITY CONTROLLER */}
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

          {/* REMOVE BUTTON */}
          <button
            className="remove-btn"
            onClick={() => removeFromCart(item._id)}
          >
            ✕
          </button>

        </div>
      ))}

      {/* SUMMARY */}
      <div className="cart-summary">
        <h3>Total: ₹{totalAmount}</h3>

        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>

    </div>
  );
};

export default Cart;