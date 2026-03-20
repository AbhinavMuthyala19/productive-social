import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  deletePostApi,
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
  const [page, setPage] = useState({
    global: 0,
    community: 0,
    user: 0,
  });

  const [hasMore, setHasMore] = useState({
    global: true,
    community: true,
    user: true,
  });
  const PAGE_SIZE = 10;

  const mergePosts = useCallback((newPosts) => {
    setPosts((prev) => {
      const map = new Map(prev.map((p) => [p.postId, p]));

      newPosts.forEach((post) => {
        map.set(post.postId, {
          ...(map.get(post.postId) || {}),
          ...post,
        });
      });

      return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    });
  }, []);

  const updatePost = useCallback((postId, updater) => {
    setPosts((prev) => prev.map((p) => (p.postId === postId ? updater(p) : p)));
  }, []);

  const fetchFeed = useCallback(
    async (type, apiCall, pageNumber = 0) => {
      try {
        setLoading((l) => ({ ...l, [type]: true }));

        const res = await apiCall({
          page: pageNumber,
          pageSize: PAGE_SIZE,
        });

        const data = res.data;
        const posts = data.content ?? data ?? [];

        mergePosts(posts);

        setPage((p) => ({ ...p, [type]: pageNumber }));
        setHasMore((h) => ({ ...h, [type]: posts.length === PAGE_SIZE}));
      } catch (e) {
        setError(e);
      } finally {
        setLoading((l) => ({ ...l, [type]: false }));
      }
    },
    [mergePosts],
  );

  const fetchPosts = useCallback(
    (pageNumber = 0) =>
      fetchFeed("global", (params) => getGlobalPosts(params), pageNumber),
    [fetchFeed],
  );

  const fetchCommunityPosts = useCallback(
    (communityId, pageNumber = 0) =>
      fetchFeed(
        "community",
        (params) => getCommunityPosts(communityId, params),
        pageNumber,
      ),
    [fetchFeed],
  );

  const fetchUserPosts = useCallback(
    (username, pageNumber = 0) =>
      fetchFeed(
        "user",
        (params) =>
          username
            ? getUserPostsByUserName(username, params)
            : getUserPosts(params),
        pageNumber,
      ),
    [fetchFeed],
  );

  const loadMoreGlobal = useCallback(() => {
    if (loading.global || !hasMore.global) return;
    fetchPosts(page.global + 1);
  }, [loading.global, hasMore.global, page.global, fetchPosts]);

  const loadMoreCommunity = useCallback(
    (communityId) => {
      if (loading.community || !hasMore.community) return;
      fetchCommunityPosts(communityId, page.community + 1);
    },
    [loading.community, hasMore.community, page.community, fetchCommunityPosts],
  );

  const loadMoreUser = useCallback(
    (username) => {
      if (loading.user || !hasMore.user) return;
      fetchUserPosts(username, page.user + 1);
    },
    [loading.user, hasMore.user, page.user, fetchUserPosts],
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

  const deletePost = useCallback(async (postId) => {
  // optimistic update
  setPosts((prev) => prev.filter((p) => p.postId !== postId));

  try {
    await deletePostApi(postId);
    toast.success("Post deleted...")
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to delete post, try again later"
    );

    // rollback (optional advanced)
    fetchPosts(); // simple fallback
  }
}, [fetchPosts]);

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
      deletePost,
      toggleLike,
      handleCommentAdded,
      loadMoreGlobal,
      loadMoreCommunity,
      loadMoreUser,
      hasMore,
    }),
    [
      posts,
      loading,
      error,
      fetchPosts,
      fetchCommunityPosts,
      fetchUserPosts,
      addPost,
      deletePost,
      toggleLike,
      handleCommentAdded,
      loadMoreGlobal,
      loadMoreCommunity,
      loadMoreUser,
      hasMore,
    ],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
