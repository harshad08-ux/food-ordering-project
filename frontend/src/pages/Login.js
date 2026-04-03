import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user" // UI only
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ send only email + password
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email,
          password: form.password
        }
      );

      // ✅ save auth
      login(res.data);

      // ✅ role comes from DB response
      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/home");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🍕 Welcome Back</h1>
        <p>Login to continue your food journey</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          {/* UI only role selector */}
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="user">👤 Customer</option>
            <option value="owner">🍔 Restaurant Owner</option>
            <option value="admin">🛠 Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <p className="switch-auth">
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;