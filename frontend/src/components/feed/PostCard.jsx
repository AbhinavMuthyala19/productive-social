import { Card } from "../ui/Card";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostFooter } from "./PostFooter";
import { CommentModal } from "./CommentModal";
import { forwardRef, useContext, useMemo, useState } from "react";
import "./PostCard.css";
import { TimeAgo } from "../../../utils/TimeAgo";
import { PostContext } from "../../context/PostContext";

export const PostCard = forwardRef(({
  post,
  onCommentAdded,
  onToggleLike,
  displayCommunityBadge,
  displayStreakBadge,
  userNameClickable,
}, ref) => {
  const [showComments, setShowComments] = useState(false);
  const { deletePost } = useContext(PostContext);

  const handleDelete = async () => {
    await deletePost(post.postId);
  };
  const createdAt = useMemo(
    () => TimeAgo(post.createdAt),
    [post.createdAt]
  )

  return (
    <Card ref={ref} className="post-card">
      <PostHeader
        user={post.user}
        createdAt={createdAt}
        community={post.community}
        streak={post.community.streak}
        displayCommunityBadge={displayCommunityBadge}
        displayStreakBadge={displayStreakBadge}
        userNameClickable={userNameClickable}
        onDelete={handleDelete}
      />

      <PostBody
        title={post.title}
        content={post.content}
        images={post.images}
        notes={post.notes}
      />
      <PostFooter
        post={post}
        onOpenComments={() => setShowComments(true)}
        onToggleLike={() => onToggleLike(post)}
      />

      <CommentModal
        postId={post.postId}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={onCommentAdded}
      />
    </Card>
  );
});
