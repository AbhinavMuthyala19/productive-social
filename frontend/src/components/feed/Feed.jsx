import { useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { CommentModal } from "./CommentModal";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { NotesViewModal } from "../notes/NotesViewModal";

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
  const [activePostId, setActivePostId] = useState(null);
  const [activeNotes, setActiveNotes] = useState(null);
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
            onOpenComments={() => setActivePostId(post.postId)}
            onOpenNotes={(notes) => setActiveNotes(notes)}
            displayCommunityBadge={displayCommunityBadge}
            displayStreakBadge={displayStreakBadge}
            userNameClickable={userNameClickable}
          />
        );
      })}

      {loading && <PostCardSkeleton />}
      <CommentModal
        postId={activePostId}
        isOpen={!!activePostId}
        onClose={() => setActivePostId(null)}
        onCommentAdded={onCommentAdded}
      />
      <NotesViewModal
        notes={activeNotes}
        isOpen={!!activeNotes}
        onClose={() => setActiveNotes(null)}
      />
    </>
  );
};
