import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getCommunityPosts,
  getGlobalPosts,
  getUserPosts,
  getUserPostsByUserName,
  likePosts,
  unlikePosts,
} from "../lib/api";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState({
    global: false,
    community: false,
    user: false,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPosts([]); // 🔥 RESET POSTS ON LOGOUT
    } else {
      fetchPosts(); // 🔥 REFRESH POSTS ON LOGIN
    }
  }, [user, authLoading]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading((l) => ({ ...l, global: true }));
      const res = await getGlobalPosts();
      mergePosts(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading((l) => ({ ...l, global: false }));
    }
  }, []);

  const fetchCommunityPosts = useCallback(async (communityId) => {
    try {
      setLoading((l) => ({ ...l, community: true }));
      const res = await getCommunityPosts(communityId);
      mergePosts(res.data);
    } finally {
      setLoading((l) => ({ ...l, community: false }));
    }
  }, []);

  const fetchUserPosts = useCallback(async (username) => {
    try {
      setLoading((l) => ({ ...l, user: true }));
      const res = username
        ? await getUserPostsByUserName(username)
        : await getUserPosts();
      mergePosts(res.data);
    } finally {
      setLoading((l) => ({ ...l, user: false }));
    }
  }, []);

  const addPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

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

  const handleCommentAdded = useCallback((postId) => {
    updatePost(postId, (p) => ({
      ...p,
      commentsCount: p.commentsCount + 1,
    }));
  }, []);

  const mergePosts = (newPosts) => {
    setPosts((prev) => {
      const map = new Map(prev.map((p) => [p.postId, p]));

      newPosts.forEach((post) => {
        map.set(post.postId, {
          ...map.get(post.postId),
          ...post,
        });
      });

      return Array.from(map.values());
    });
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        fetchCommunityPosts,
        fetchUserPosts,
        addPost,
        toggleLike,
        handleCommentAdded,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
