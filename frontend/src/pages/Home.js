import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./Home.css";


const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");

  const { addToCart, updateQuantity, cart } = useCart();

  useEffect(() => {
    fetchRestaurant();
    fetchFoods();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/restaurants`
      );
      const found = res.data.find((r) => r._id === id);
      setRestaurant(found);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/foods/restaurant/${id}`
      );
      setFoods(res.data);
    } catch (err) {
      setError("Failed to load menu");
    }
  };

  const groupedFoods = foods.reduce((acc, food) => {
    const category = food.category || "Popular";
    if (!acc[category]) acc[category] = [];
    acc[category].push(food);
    return acc;
  }, {});

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="restaurant-page">

      {/* HERO SECTION */}
      {restaurant && (
        <div className="restaurant-hero">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/800x400")
            }
          />

          <div className="hero-overlay">
            <h1>{restaurant.name}</h1>

            <div className="hero-meta">
              <span>⭐ {restaurant.rating || 4.5}</span>
              <span>⏱ {restaurant.deliveryTime || "30-40 min"}</span>
              <span
                className={
                  restaurant.isOpen ? "status open" : "status closed"
                }
              >
                {restaurant.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>

            <p>{restaurant.address}</p>
          </div>
        </div>
      )}

      {/* MENU SECTION */}
      <div className="menu-section">
        {error && <p className="error">{error}</p>}

        {Object.keys(groupedFoods).map((category) => (
          <div key={category} className="menu-category">
            <h3>{category}</h3>

            {groupedFoods[category].map((food) => {
              const cartItem = cart.find(
                (item) => item._id === food._id
              );

              return (
                <div className="menu-card" key={food._id}>

                  {/* IMAGE */}
                  <div className="menu-image">
                    <img
                      src={
                        food.image ||
                        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3"
                      }
                      alt={food.name}
                    />
                  </div>

                  {/* INFO */}
                  <div className="menu-content">
                    <div className="food-header">
                      <span
                        className={
                          food.isVeg ? "veg-dot" : "nonveg-dot"
                        }
                      ></span>

                      <h4>{food.name}</h4>
                    </div>

                    {food.description && (
                      <p className="description">
                        {food.description}
                      </p>
                    )}

                    <p className="price">₹{food.price}</p>
                  </div>

                  {/* ACTION */}
                  <div className="menu-action">
                    {!cartItem ? (
                      <button
                        className="add-btn"
                        onClick={() => addToCart(food)}
                      >
                        ADD +
                      </button>
                    ) : (
                      <div className="qty-controller">
                        <button
                          onClick={() =>
                            updateQuantity(
                              food._id,
                              cartItem.quantity - 1
                            )
                          }
                        >
                          -
                        </button>

                        <span>{cartItem.quantity}</span>

                        <button
                          onClick={() => addToCart(food)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* FLOATING CART BAR */}
      {cart.length > 0 && (
        <div className="floating-cart">
          <div className="cart-info">
            🛒 {totalItems} items
            <span className="cart-total">
              ₹{totalAmount}
            </span>
          </div>

          <button
            className="view-cart-btn"
            onClick={() => navigate("/cart")}
          >
            VIEW CART →
          </button>
        </div>
      )}

    </div>
  );
};

export default Home;