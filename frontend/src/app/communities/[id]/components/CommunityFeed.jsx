import { PostCard } from "../../../../components/feed/PostCard";
import { PostCardSkeleton } from "../../../../components/feed/PostCardSkeleton";

export const CommunityFeed = ({ posts, loading, onToggleLike, onCommentAdded}) => {

  
  if (loading) {
    return Array.from({ length: 3 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ));
  }
  if (!loading && posts.length === 0) {
    return <div>No posts yet</div>;
  }

  return posts.map((post) => (
    <PostCard
      key={post.postId}
      post={post}
      onCommentAdded={() => onCommentAdded(post.postId)}
      onToggleLike={onToggleLike}
      displayStreakBadge={true}
    />
  ));
};
