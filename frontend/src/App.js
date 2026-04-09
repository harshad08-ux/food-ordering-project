import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerMenu from "./pages/OwnerMenu";
import OwnerOrders from "./pages/OwnerOrders";
import OwnerCreateRestaurant from "./pages/OwnerCreateRestaurant";
import OwnerPendingApproval from "./pages/OwnerPendingApproval";
import OwnerEntryRedirect from "./pages/OwnerEntryRedirect";
import OrderSuccess from "./pages/OrderSuccess";

import AdminRoute from "./components/AdminRoute";
import BottomNav from "./components/BottomNav";

import "./App.css";

function App() {
  const { user, logout } = useAuth();

  const token = user?.token;
  const role = user?.role;

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT */}
        <Route
          path="/"
          element={
            !token ? (
              <Login />
            ) : role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : role === "owner" ? (
              <OwnerEntryRedirect />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            !token ? (
              <Login />
            ) : role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : role === "owner" ? (
              <OwnerEntryRedirect />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" replace />}
        />

        {/* USER */}
        <Route
          path="/home"
          element={
            token && role === "user" ? (
              <div className="home-page-wrapper">
                <header className="navbar">
                  <h1>Food Ordering App 🍔</h1>

                  <div className="nav-buttons">
                    <button onClick={() => setDarkMode(!darkMode)}>
                      {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
                    <button onClick={logout}>Logout</button>
                  </div>
                </header>

                <Restaurants />
                <BottomNav />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/restaurant/:id"
          element={
            token && role === "user" ? (
              <>
                <Home />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/cart"
          element={
            token && role === "user" ? (
              <>
                <Cart />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/my-orders"
          element={
            token && role === "user" ? (
              <>
                <MyOrders />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/order-success"
          element={token ? <OrderSuccess /> : <Navigate to="/login" replace />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        {/* OWNER */}
        <Route
          path="/owner/create-restaurant"
          element={
            token && role === "owner" ? (
              <OwnerCreateRestaurant />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/owner/pending-approval"
          element={
            token && role === "owner" ? (
              <OwnerPendingApproval />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            token && role === "owner" ? (
              <OwnerDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/owner/menu"
          element={
            token && role === "owner" ? (
              <OwnerMenu />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/owner/orders"
          element={
            token && role === "owner" ? (
              <OwnerOrders />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;