import { useAuth } from "../context/AuthContext";
import "./OwnerPendingApproval.css";

const OwnerPendingApproval = () => {
  const { logout } = useAuth();

  return (
    <div className="pending-page">
      <div className="pending-card">
        <h1>⏳ Approval Pending</h1>
        <p>
          Your restaurant request is waiting for admin approval.
        </p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default OwnerPendingApproval;