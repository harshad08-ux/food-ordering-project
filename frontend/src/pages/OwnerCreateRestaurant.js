import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./OwnerCreateRestaurant.css";

const OwnerCreateRestaurant = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    cuisine: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/restaurants",
        form,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Restaurant created successfully 🎉");

      // after create → dashboard
      navigate("/owner/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="owner-create-page">
      <div className="owner-create-card">
        <h2>Create Your Restaurant 🍽️</h2>

        <form
          className="owner-create-form"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Restaurant Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            required
          />

          <input
            placeholder="Cuisine"
            value={form.cuisine}
            onChange={(e) =>
              setForm({ ...form, cuisine: e.target.value })
            }
            required
          />

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <button type="submit">Create Restaurant</button>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerCreateRestaurant;