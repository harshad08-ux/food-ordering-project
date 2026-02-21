import API from "./api";

export const getRestaurants = () => {
  return API.get("/restaurants");
};

export const getRestaurantById = (id) => {
  return API.get(`/restaurants/${id}`);
};
