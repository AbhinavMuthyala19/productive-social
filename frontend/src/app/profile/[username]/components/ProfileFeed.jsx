import { PostCard } from "../../../../components/feed/PostCard";
import { PostCardSkeleton } from "../../../../components/feed/PotCardSkeleton";
import "../../Profile.css";

export const ProfileFeed = ({ posts, loading, onCommentAdded }) => {
  if (loading) {
    return Array.from({ length: 3 }).map((_, i) => (
      <PostCardSkeleton key={`profile-feed-skeleton-${i}`} />
    ));
  }

  if (!loading && posts.length === 0) {
    return <div className="empty-feed">No posts yet</div>;
  }

  return posts.map((post) => (
    <PostCard
      key={post.postId}
      post={post}
      onCommentAdded={() => onCommentAdded(post.postId)}
      displayCommunityBadge
      userNameClickable={false}
    />
  ));
};
