import { PageContainer } from "../../components/layout/PageContainer";
import { Navbar } from "../../components/layout/Navbar";
import { PostCard } from "../../components/feed/PostCard";
import { NewPostButton } from "../../components/feed/NewPostButton";
import { PageHeader } from "../../components/layout/PageHeader";
import "../../App.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { PostContext } from "../../context/PostContext";
import { PostCardSkeleton } from "../../components/feed/PotCardSkeleton";
import { CommunityContext } from "../../context/CommunityContext";
import { CreatePostModal } from "../../components/feed/CreatePostModal";

export const Home = () => {
  const { posts, loading, handleCommentAdded, addPost } =
    useContext(PostContext);

  const { communities } = useContext(CommunityContext);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const joinedCommunitiesMap = useMemo(() => {
    return new Map(communities.filter((c) => c.joined).map((c) => [c.id, c]));
  }, [communities]);

  const joinedPosts = useMemo(
    () => posts.filter((post) => joinedCommunitiesMap.has(post.community.id)),
    [posts, joinedCommunitiesMap],
  );

  const joinedCommunityOptions = useMemo(
    () => Array.from(joinedCommunitiesMap.values()),
    [joinedCommunitiesMap],
  );

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
        {loading.global ? (
          Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
        ) : joinedPosts.length === 0 ? (
          <div>No posts yet from your communities</div>
        ) : (
          joinedPosts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onCommentAdded={() => handleCommentAdded(post.postId)}
              displayCommunityBadge
              displayStreakBadge={true}
            />
          ))
        )}
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
