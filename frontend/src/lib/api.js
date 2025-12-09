import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL,
  withCredentials: true, // important for cookies (JWT)
});



export const loginUser = (identifier, password) =>
  api.post("/auth/login", { identifier, password });

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getProfile = () =>
  api.get("/profile");

// export const getPosts = () =>
//   api.get("/api/posts");

export default api;