import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active" : "";

  return (
    <div className="bottom-nav">
      <Link to="/home" className={isActive("/home")}>
        <span>🏠</span>
        <p>Home</p>
      </Link>

      <Link to="/cart" className={isActive("/cart")}>
        <span>🛒</span>
        <p>Cart</p>
      </Link>

      <Link to="/my-orders" className={isActive("/my-orders")}>
        <span>📦</span>
        <p>Orders</p>
      </Link>
    </div>
  );
};

export default BottomNav;
