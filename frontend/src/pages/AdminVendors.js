import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./AdminVendors.css";

const AdminVendors = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/restaurants/pending",
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    setVendors(res.data);
  };

  const updateVendor = async (id, status) => {
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
  };

  return (
    <div className="admin-vendors">
      <h1>🏪 Pending Vendor Approvals</h1>

      {vendors.map((vendor) => (
        <div className="vendor-card" key={vendor._id}>
          <h3>{vendor.name}</h3>
          <p>{vendor.owner?.email}</p>

          <div className="vendor-actions">
            <button
              onClick={() =>
                updateVendor(vendor._id, "approved")
              }
            >
              Approve
            </button>

            <button
              onClick={() =>
                updateVendor(vendor._id, "rejected")
              }
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminVendors;