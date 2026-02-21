import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./Home.css";

const Home = () => {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRestaurant();
    fetchFoods();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/restaurants/`
      );

      console.log("Foods API Response:", res.data); 

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
    acc[food.category] = acc[food.category] || [];
    acc[food.category].push(food);
    return acc;
  }, {});

  return (
    <div className="restaurant-page">
      {/* 🔥 HERO SECTION */}
      {restaurant && (
        <div className="restaurant-hero">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/800x400")
            }
          />

          <div className="hero-overlay">
            <h1>{restaurant.name}</h1>

            <div className="hero-meta">
              <span className="rating">
                ⭐ {restaurant.rating || 4.5}
              </span>

              <span className="delivery">
                ⏱ {restaurant.deliveryTime || "30-40 min"}
              </span>

              <span
                className={
                  restaurant.isOpen ? "open" : "closed"
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

        {foods.length > 0 &&
  Object.keys(groupedFoods).map((category) => (

          <div key={category} className="menu-category">
            <h3>{category}</h3>

            {groupedFoods[category].map((food) => (
              <div className="menu-item" key={food._id}>
                <div>
                  <h4>{food.name}</h4>
                  <p>₹{food.price}</p>
                </div>

                <button
                  className="add-btn"
                  onClick={() => addToCart(food)}
                >
                  ADD +
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
