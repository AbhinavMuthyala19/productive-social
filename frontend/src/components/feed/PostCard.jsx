import { Card } from "../ui/Card";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { PostFooter } from "./PostFooter";
import { CommentModal } from "./CommentModal";
import { useContext, useState } from "react";
import "./PostCard.css";
import { PostContext } from "../../context/PostContext";

export const PostCard = ({
  post,
  onCommentAdded,
  displayCommunityBadge,
  displayStreakBadge,
  userNameClickable
}) => {
  const [showComments, setShowComments] = useState(false);
  const {toggleLike} = useContext(PostContext)

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return new Intl.RelativeTimeFormat("en", {
          numeric: "auto",
        }).format(-count, interval.label);
      }
    }

    return "just now";
  }

  return (
    <Card className="post-card">
      <PostHeader
        user={post.user}
        createdAt={timeAgo(post.createdAt)}
        community={post.community}
        streak={`${post.community.streak}`}
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
        onToggleLike={() => toggleLike(post)}
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
