import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { toast } from "sonner";

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

  const mergePosts = useCallback((newPosts) => {
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
  }, []);

  const updatePost = useCallback((postId, updater) => {
    setPosts((prev) => prev.map((p) => (p.postId === postId ? updater(p) : p)));
  }, []);

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
  }, [mergePosts]);

  const fetchCommunityPosts = useCallback(
    async (communityId) => {
      try {
        setLoading((l) => ({ ...l, community: true }));
        const res = await getCommunityPosts(communityId);
        mergePosts(res.data);
      } finally {
        setLoading((l) => ({ ...l, community: false }));
      }
    },
    [mergePosts],
  );

  const fetchUserPosts = useCallback(
    async (username) => {
      try {
        setLoading((l) => ({ ...l, user: true }));
        const res = username
          ? await getUserPostsByUserName(username)
          : await getUserPosts();
        mergePosts(res.data);
      } finally {
        setLoading((l) => ({ ...l, user: false }));
      }
    },
    [mergePosts],
  );

  const handleCommentAdded = useCallback(
    (postId) => {
      updatePost(postId, (p) => ({
        ...p,
        commentsCount: p.commentsCount + 1,
      }));
    },
    [updatePost],
  );

  const addPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const likePost = async (postId) => {
    updatePost(postId, (p) => ({
      ...p,
      likedByCurrentUser: true,
      likesCount: p.likesCount + 1,
    }));

    try {
      await likePosts(postId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, try again later",
      );

      updatePost(postId, (p) => ({
        ...p,
        likedByCurrentUser: false,
        likesCount: p.likesCount - 1,
      }));
    }
  };

  const unlikePost = async (postId) => {
    updatePost(postId, (p) => ({
      ...p,
      likedByCurrentUser: false,
      likesCount: p.likesCount - 1,
    }));
    try {
      await unlikePosts(postId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, try again later",
      );
      updatePost(postId, (p) => ({
        ...p,
        likedByCurrentUser: true,
        likesCount: p.likesCount + 1,
      }));
    }
  };

  const toggleLike = useCallback(
    async (post) => {
      if (post.likedByCurrentUser) {
        await unlikePost(post.postId);
      } else {
        await likePost(post.postId);
      }
    },
    [likePost, unlikePost],
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPosts([]);
    } else {
      fetchPosts();
    }
  }, [user, authLoading, fetchPosts]);

  const value = useMemo(
    () => ({
      posts,
      loading,
      error,
      fetchPosts,
      fetchCommunityPosts,
      fetchUserPosts,
      addPost,
      toggleLike,
      handleCommentAdded,
    }),
    [
      posts,
      loading,
      error,
      fetchPosts,
      fetchCommunityPosts,
      fetchUserPosts,
      addPost,
      toggleLike,
      handleCommentAdded,
    ],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
