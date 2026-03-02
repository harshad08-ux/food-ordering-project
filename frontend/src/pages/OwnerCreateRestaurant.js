import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const OwnerCreateRestaurant = () => {
  const { user } = useAuth();
  const { logout } = useAuth();

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

      alert("Restaurant created!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
  
    
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
    <h2>Create Your Restaurant</h2>
    <button onClick={logout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Address"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />
        <input
          placeholder="Cuisine"
          onChange={(e) =>
            setForm({ ...form, cuisine: e.target.value })
          }
        />
        <input
          placeholder="Image URL"
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default OwnerCreateRestaurant;