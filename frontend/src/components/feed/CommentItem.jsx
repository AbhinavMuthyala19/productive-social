import { useNavigate } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import "./CommentItem.css";

export const CommentItem = ({ comment, onReply }) => {
  const navigate = useNavigate();
  const renderWithMentions = (text) => {
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.substring(1);
        return (
          <a key={index} href={`/profile/${username}`} className="mention">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="comment-item">
      <div className="comment-box">
        <div className="comment">
          <div className="name">
            <Avatar alt={comment.username} />
            <p onClick={() => navigate(`/profile/${comment.username}`)}>
              {comment.username}
            </p>
          </div>

          <p className="comment-text">{renderWithMentions(comment.content)}</p>
        </div>

        <Button
          type="button"
          className="comment-reply"
          onClick={() => onReply(comment)}
        >
          Reply
        </Button>
      </div>

      {comment.replies?.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};
