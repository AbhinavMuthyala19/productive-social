import { Card } from "../ui/Card";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostFooter } from "./PostFooter";
import { CommentModal } from "./CommentModal";
import { useMemo, useState } from "react";
import "./PostCard.css";
import { TimeAgo } from "../../../utils/TimeAgo";

export const PostCard = ({
  post,
  onCommentAdded,
  onToggleLike,
  displayCommunityBadge,
  displayStreakBadge,
  userNameClickable,
}) => {
  const [showComments, setShowComments] = useState(false);

  const createdAt = useMemo(
    () => TimeAgo(post.createdAt),
    [post.createdAt]
  )

  return (
    <Card className="post-card">
      <PostHeader
        user={post.user}
        createdAt={createdAt}
        community={post.community}
        streak={post.community.streak}
        displayCommunityBadge={displayCommunityBadge}
        displayStreakBadge={displayStreakBadge}
        userNameClickable={userNameClickable}
      />

      <PostBody
        title={post.title}
        content={post.content}
        images={post.images}
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
};
