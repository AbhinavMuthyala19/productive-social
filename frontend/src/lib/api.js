import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL,
  withCredentials: true, // important for cookies (JWT)
});

let isRefreshing = false;
let queue = [];

function resolveQueue() {
  queue.forEach(cb => cb());
  queue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/register")
    ) {
      return Promise.reject(error);
    }

    // Normalize URL (handles axios removing slashes)
    const url = original.url.replace(api.defaults.baseURL, "");

    // 🚫 NEVER refresh auth endpoints
    if (url.startsWith("/auth")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise(resolve => {
          queue.push(() => resolve(api(original)));
        });
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh");

        isRefreshing = false;

        resolveQueue();

        return api(original);

      } catch (refreshErr) {
        isRefreshing = false;
        queue = [];
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export const loginUser = (identifier, password) =>
  api.post("/auth/login", { identifier, password });

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getProfile = () =>
  api.get("/profile");

export const logoutUser = () =>
  api.post("/auth/logout");

export const getCommunities = () =>
  api.get("/communities")
// export const getPosts = () =>
//   api.get("/api/posts");

export default api;