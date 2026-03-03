import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import OwnerMenu from "./pages/OwnerMenu";
import BottomNav from "./components/BottomNav";
import OrderSuccess from "./pages/OrderSuccess";
import OwnerDashboard from "./pages/OwnerDashboard";
import "./App.css";

function App() {
  const { user, logout } = useAuth();

  const token = user?.token;
  const role = user?.role;

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔁 ROOT DECISION */}
        <Route
  path="/"
  element={
    !token ? (
      <Navigate to="/login" replace />
    ) : role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : role === "owner" ? (
      <Navigate to="/owner/dashboard" replace />
    ) : (
      <Navigate to="/home" replace />
    )
  }
/>

        {/* 🔐 AUTH */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" replace />}
        />

        {/* 👤 USER HOME */}
        <Route
          path="/home"
          element={
            token && role === "user" ? (
              <>
                <header className="navbar">
                  <h1>Food Ordering App 🍔</h1>
                  <button onClick={logout}>Logout</button>
                </header>

                <Restaurants />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 🍽️ MENU PAGE */}
        <Route
          path="/restaurant/:id"
          element={
            token && role === "user" ? (
              <>
                <Home />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 🛒 CART */}
        <Route
          path="/cart"
          element={
            token && role === "user" ? (
              <>
                <Cart />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 📦 MY ORDERS */}
        <Route
          path="/my-orders"
          element={
            token && role === "user" ? (
              <>
                <MyOrders />
                <BottomNav />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 🎉 ORDER SUCCESS */}
        <Route
          path="/order-success"
          element={
            token ? <OrderSuccess /> : <Navigate to="/" replace />
          }
        />

        {/* 👑 ADMIN ROUTES */}
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



        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;