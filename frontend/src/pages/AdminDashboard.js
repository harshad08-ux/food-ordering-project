import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    preparing: 0,
    delivered: 0
  });

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPendingVendors();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchPendingVendors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/restaurants/pending",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setVendors(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const updateVendorStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/restaurants/${id}/approve`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      fetchPendingVendors();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-dashboard">

      <div className="admin-header">
        <h1>🛠 Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {/* ANALYTICS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="stat-card">
          <h3>Preparing</h3>
          <p>{stats.preparing}</p>
        </div>

        <div className="stat-card">
          <h3>Delivered</h3>
          <p>{stats.delivered}</p>
        </div>
      </div>

      {/* VENDOR APPROVAL */}
      <div className="vendor-section">
        <h2>🏪 Pending Vendor Approvals</h2>

        {vendors.length === 0 ? (
          <p>No pending vendors</p>
        ) : (
          vendors.map((vendor) => (
            <div className="vendor-card" key={vendor._id}>
              <div>
                <h3>{vendor.name}</h3>
                <p>{vendor.owner?.email}</p>
                <p>{vendor.address}</p>
              </div>

              <div className="vendor-actions">
                <button
                  className="approve-btn"
                  onClick={() =>
                    updateVendorStatus(vendor._id, "approved")
                  }
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() =>
                    updateVendorStatus(vendor._id, "rejected")
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;