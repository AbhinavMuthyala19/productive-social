import { PageContainer } from "../../components/layout/PageContainer";
import { Navbar } from "../../components/layout/Navbar";
import { NewPostButton } from "../../components/feed/NewPostButton";
import { PageHeader } from "../../components/layout/PageHeader";
import "../../App.css";
import { useContext, useMemo, useState } from "react";
import { PostContext } from "../../context/PostContext";
import { CommunityContext } from "../../context/CommunityContext";
import { CreatePostModal } from "../../components/feed/CreatePostModal";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { Feed } from "../../components/feed/Feed";

export const Home = () => {
  const {
    posts,
    loading,
    handleCommentAdded,
    addPost,
    toggleLike,
    loadMoreGlobal,
    hasMore,
  } = useContext(PostContext);

  const { communities } = useContext(CommunityContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const lastPostRef = useInfiniteScroll(
    loading.global,
    hasMore.global,
    loadMoreGlobal,
  );

  const joinedCommunitiesMap = useMemo(() => {
    return new Map(
      (communities || []).filter((c) => c.joined).map((c) => [c.id, c]),
    );
  }, [communities]);

  const joinedPosts = useMemo(
    () =>
      (posts || []).filter((post) =>
        joinedCommunitiesMap.has(post.community.id),
      ),
    [posts, joinedCommunitiesMap],
  );

  const joinedCommunityOptions = useMemo(
    () => Array.from(joinedCommunitiesMap.values()),
    [joinedCommunitiesMap],
  );

  console.log(joinedCommunitiesMap);
  console.log(joinedPosts);
  console.log("loading", loading);
  console.log("posts", posts);
  const lastIndex = joinedPosts.length - 1;
  return (
    <PageContainer>
      <Navbar />
      <PageHeader
        title="Global Feed"
        description="Join challenge-based communities and stay accountable"
      >
        <NewPostButton onClick={() => setShowCreatePost(true)} />
      </PageHeader>

      <div className="main">
        <Feed
          posts={joinedPosts}
          displayCommunityBadge
          displayStreakBadge
          loading={loading.global}
          hasMore={hasMore.global}
          loadMore={loadMoreGlobal}
          onCommentAdded={handleCommentAdded}
          onToggleLike={toggleLike}
        />
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        joinedCommunities={joinedCommunityOptions}
        onPostCreated={addPost}
      />
    </PageContainer>
  );
};
