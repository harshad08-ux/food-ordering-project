import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OwnerMenu.css";

const OwnerMenu = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
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

  const handleAddFood = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/foods",
        form,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setForm({
        name: "",
        price: "",
        category: "",
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

  return (
    <div className="owner-menu">
      <h1>🍽 Manage Menu</h1>

      <form className="menu-form" onSubmit={handleAddFood}>
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

        <button type="submit">Add Food</button>
      </form>

      <div className="food-list">
        {foods.map((food) => (
          <div className="food-card" key={food._id}>
            <h3>{food.name}</h3>
            <p>₹{food.price}</p>
            <button onClick={() => handleDelete(food._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerMenu;