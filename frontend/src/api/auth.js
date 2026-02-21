import API from "./api";

export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", {
    email,
    password
  });
  return res.data;
};
