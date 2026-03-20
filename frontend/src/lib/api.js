import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL,
  withCredentials: true, // important for cookies (JWT)
});

let isRefreshing = false;
let queue = [];

function resolveQueue() {
  queue.forEach((cb) => cb());
  queue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/register") ||
      window.location.pathname.startsWith("/verify-email") ||
      window.location.pathname.startsWith("/forgot-password") ||
      window.location.pathname.startsWith("/reset-password")
    ) {
      return Promise.reject(error);
    }

    // Normalize URL (handles axios removing slashes)
    const url = original.url.startsWith("http")
      ? original.url.replace(api.defaults.baseURL, "")
      : original.url;

    // 🚫 NEVER refresh auth endpoints
    if (
      url.startsWith("/auth/login") ||
      url.startsWith("/auth/logout") ||
      url.startsWith("/auth/verify-email") ||
      url.startsWith("/auth/forgot-password") ||
      url.startsWith("/auth/reset-password")||
      url.startsWith("/auth/refresh") ||
      url.startsWith("/auth/sso")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
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
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export const registerUser = (data) => api.post("/auth/register", data);

export const verifyUser = (email, otp) =>
  api.post("/auth/verify-email", { email, otp });

export const resendVerifyUser = (email) =>
  api.post("/resend-verification", { email });

export const loginUser = (identifier, password, timezone) =>
  api.post("/auth/login", { identifier, password, timezone });

export const googleLogin = (token) =>
  api.post("/auth/sso", { token, authProvider: "GOOGLE" });

export const forgotPassword = ({ email }) =>
  api.post("/auth/forgot-password", null, { params: { email } });

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });

export const getUser = () => api.get("/auth/me");

export const logoutUser = () => api.post("/auth/logout");

export const getCommunities = () => api.get("/communities");

export const joinCommunity = (communityId) =>
  api.post("/communities/join", { communityId });

export const leaveCommunity = (communityId) =>
  api.post(`/communities/${communityId}/leave`);

export const getCommunity = (communityId) =>
  api.get(`/communities/${communityId}`);

export const getGlobalPosts = (params) =>
  api.get("/posts/feed/global", { params });

export const getCommunityPosts = (communityId, params) =>
  api.get(`/posts/feed/community/${communityId}`, { params });

export const getUserPosts = (params) => api.get("/posts/feed/me", { params });

export const getUserPostsByUserName = (username, params) =>
  api.get(`/posts/feed/${username}`, { params });

export const likePosts = (postId) => api.post(`/posts/${postId}/like`);

export const unlikePosts = (postId) => api.delete(`/posts/${postId}/like`);

export const postComments = (comment) => api.post("/comments", comment);

export const getPostComments = (postId) => api.get(`/comments/post/${postId}`);

export const createPost = (formData) => api.post("/posts", formData);

export const getCommunitySyllabus = (communityId) =>
  api.get(`/communities/${communityId}/tasks`);

export const updateCommunityTask = (communityId, taskId, completed) =>
  api.post(`/communities/${communityId}/tasks/update`, { taskId, completed });

export const getUserProfile = () => api.get("/profile/me");

export const getUserProfileByUserName = (username) =>
  api.get(`/profile/${username}`);

export const getUserCommunities = () => api.get("/communities/me");

export const getUserCommunitiesByUserName = (username) =>
  api.get(`/communities/user/${username}`);

export const getNotesFromSyllabus = (taskId) =>
  api.get(`/tasks/${taskId}/notes`);

export const uploadNotes = (formData) => api.post("/notes", formData);

export const downloadNotes = (notesId) => api.get(`/notes/${notesId}/download`);

export const getUserNotes = () => api.get("/notes/me");

export const getUserNotesByUserName = (username) =>
  api.get(`/notes/${username}`);

export const deletePostApi = (postId) =>
  api.delete(`/posts/${postId}`)

export default api;
