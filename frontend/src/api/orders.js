import API from "./api";

/**
 * 🛒 CREATE ORDER (USER)
 * Requires JWT token
 */
export const createOrder = (orderData) => {
  const token = localStorage.getItem("token");

  return API.post("/orders", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * 📦 GET MY ORDERS (USER)
 */
export const myOrders = () => {
  const token = localStorage.getItem("token");

  return API.get("/orders/my", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    },
  });
};

/**
 * 🛠 GET ALL ORDERS (ADMIN)
 */
export const getAllOrders = () => {
  const token = localStorage.getItem("token");

  return API.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * 🔄 UPDATE ORDER STATUS (ADMIN)
 */
export const updateOrderStatus = (id, status) => {
  const token = localStorage.getItem("token");

  return API.put(
    `/orders/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
