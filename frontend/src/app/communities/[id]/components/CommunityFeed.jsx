import { PostCard } from "../../../../components/feed/PostCard";
import { PostCardSkeleton } from "../../../../components/feed/PotCardSkeleton";

export const CommunityFeed = ({ posts, loading, onCommentAdded }) => {
  if (loading) {
    return Array.from({ length: 3 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ));
  }
  return posts.map((post) => (
    <PostCard
      key={post.postId}
      post={post}
      onCommentAdded={() => onCommentAdded(post.postId)}
      displayStreakBadge={true}
    />
  ));
};
