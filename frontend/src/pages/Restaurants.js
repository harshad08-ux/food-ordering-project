import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Restaurants.css";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🍜 GET UNIQUE CUISINES
  const cuisines = [
    "All",
    ...new Set(restaurants.map((r) => r.cuisine).filter(Boolean)),
  ];

  // 🔎 FILTER LOGIC
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "All" ||
      restaurant.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h2>🍽️ Explore Restaurants</h2>
        <p>Discover the best food near you</p>

        {/* 🔎 SEARCH */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🍱 CUISINE FILTERS */}
        <div className="cuisine-filters">
          {cuisines.map((cuisine, index) => (
            <button
              key={index}
              className={
                selectedCuisine === cuisine
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-card"
            onClick={() => navigate(`/restaurant/${restaurant._id}`)}
          >
            <div className="restaurant-image">
              <img
                src={
                  restaurant.image ||
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                }
                alt={restaurant.name}
              />
              <div className="rating-badge">⭐ 4.5</div>
            </div>

            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p>{restaurant.address}</p>
              <p className="restaurant-status">
                {restaurant.isOpen ? "🟢 Open Now" : "🔴 Closed"}
              </p>
            </div>
          </div>
        ))}

        {filteredRestaurants.length === 0 && (
          <p className="no-results">No restaurants found 😔</p>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
