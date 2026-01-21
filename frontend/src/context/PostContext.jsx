import { createContext, useContext, useEffect, useState } from "react";
import {
  getGlobalPosts,
  likePosts,
  unlikePosts,
} from "../lib/api";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setPosts([]); // 🔥 RESET POSTS ON LOGOUT
    } else {
      fetchPosts(); // 🔥 REFRESH POSTS ON LOGIN
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getGlobalPosts();
      setPosts(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const addPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const updatePost = (postId, updater) => {
    setPosts((prev) => prev.map((p) => (p.postId === postId ? updater(p) : p)));
  };

  const likePost = async (postId) => {
    updatePost(postId, (p) => ({
      ...p,
      likedByCurrentUser: true,
      likesCount: p.likesCount + 1,
    }));
    await likePosts(postId);
  };

  const unlikePost = async (postId) => {
    updatePost(postId, (p) => ({
      ...p,
      likedByCurrentUser: false,
      likesCount: p.likesCount - 1,
    }));
    await unlikePosts(postId);
  };

  const toggleLike = async (post) => {
    if (post.likedByCurrentUser) {
      await unlikePost(post.postId);
    } else {
      await likePost(post.postId);
    }
  };

  const handleCommentAdded = (postId) => {
    updatePost(postId, (p) => ({
      ...p,
      commentsCount: p.commentsCount + 1,
    }));
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        addPost,
        likePost,
        unlikePost,
        toggleLike,
        handleCommentAdded,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
