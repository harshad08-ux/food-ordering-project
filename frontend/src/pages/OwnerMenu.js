import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OwnerMenu.css";

const OwnerMenu = () => {
  const { user } = useAuth();

  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
    isVeg: true,
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/foods/owner/my",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("isVeg", form.isVeg);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/foods/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/foods",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setForm({
        name: "",
        price: "",
        category: "",
        image: null,
        isVeg: true,
      });

      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/foods/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/foods/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="owner-menu">
      <h1>🍽 Manage Menu</h1>

      <form className="menu-form" onSubmit={handleSubmit}>
        <input
          placeholder="Food Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

            <label className="file-upload">
              {form.image ? form.image.name : "Upload Food Image"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
                hidden
              />
            </label>

        <select
          value={form.isVeg}
          onChange={(e) =>
            setForm({
              ...form,
              isVeg: e.target.value === "true",
            })
          }
        >
          <option value="true">Veg 🟢</option>
          <option value="false">Non-Veg 🔴</option>
        </select>

        <button type="submit">
          {editingId ? "Update Food" : "Add Food"}
        </button>
      </form>

      <div className="food-list">
        {foods.map((food) => (
          <div className="food-card" key={food._id}>
            <img
              src={food.image}
              alt={food.name}
              className="food-image"
            />

            <div
              className={`veg-badge ${
                food.isVeg ? "veg" : "nonveg"
              }`}
            >
              {food.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
            </div>

            <p
              className={`availability ${
                food.isAvailable ? "available" : "out"
              }`}
            >
              {food.isAvailable
                ? "🟢 Available"
                : "⚪ Out of Stock"}
            </p>

            <h3>{food.name}</h3>
            <p className="food-price">₹{food.price}</p>
            <p className="food-category">{food.category}</p>

            <div className="food-actions">
              <button
                className="delete-btn"
                onClick={() => handleDelete(food._id)}
                type="button"
              >
                Delete
              </button>

              <button
                className="toggle-btn"
                onClick={() => toggleAvailability(food._id)}
                type="button"
              >
                Toggle Availability
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerMenu;