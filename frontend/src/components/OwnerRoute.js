import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OwnerRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "owner") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default OwnerRoute;