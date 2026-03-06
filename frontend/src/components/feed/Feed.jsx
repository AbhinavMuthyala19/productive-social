import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";

export const Feed = ({
  posts,
  loading,
  hasMore,
  loadMore,
  onCommentAdded,
  onToggleLike,
  displayCommunityBadge = false,
  displayStreakBadge = false,
  userNameClickable = true,
}) => {

  const lastPostRef = useInfiniteScroll(loading, hasMore, loadMore);

  // First load skeleton
  if (loading && posts.length === 0) {
    return Array.from({ length: 3 }).map((_, i) => (
      <PostCardSkeleton key={`feed-skeleton-${i}`} />
    ));
  }

  if (!loading && posts.length === 0) {
    return <div className="empty-feed">No posts yet</div>;
  }

  return (
    <>
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;

        return (
          <PostCard
            ref={isLast ? lastPostRef : null}
            key={post.postId}
            post={post}
            onCommentAdded={() => onCommentAdded(post.postId)}
            onToggleLike={onToggleLike}
            displayCommunityBadge={displayCommunityBadge}
            displayStreakBadge={displayStreakBadge}
            userNameClickable={userNameClickable}
          />
        );
      })}

      {loading && <PostCardSkeleton />}
    </>
  );
};