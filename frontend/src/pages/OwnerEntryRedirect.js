import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OwnerEntryRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRestaurant = async () => {
      try {
        await axios.get(
          "http://localhost:5000/api/restaurants/owner/my",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        navigate("/owner/dashboard", { replace: true });

      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/owner/pending-approval", { replace: true });
        } else {
          navigate("/owner/create-restaurant", { replace: true });
        }
      }
    };

    checkRestaurant();
  }, [navigate, user]);

  return <p>Loading...</p>;
};

export default OwnerEntryRedirect;