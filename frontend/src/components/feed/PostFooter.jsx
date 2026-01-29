import "./PostFooter.css";
import likeIcon from "../../assets/icons/like.svg";
import commentIcon from "../../assets/icons/comment.svg";
import shareIcon from "../../assets/icons/share.svg";
import unlikeIcon from "../../assets/icons/unlike.svg";
import { Button } from "../ui/Button";

export const PostFooter = ({ post, onOpenComments, onToggleLike }) => {
  const likeIconSrc = post.likedByCurrentUser ? likeIcon : unlikeIcon;

  return (
    <div className="post-footer">
      <div className="likes-comments">
        <Button variant="transparent-button" onClick={onToggleLike}>
          <img className="post-footer-icon" src={likeIconSrc} alt="like" />
          {post.likesCount > 0 && <p>{post.likesCount}</p>}
        </Button>

        <Button variant="transparent-button" onClick={onOpenComments}>
          <img className="post-footer-icon" src={commentIcon} alt="comment" />
          {post.commentsCount > 0 && <p>{post.commentsCount}</p>}
        </Button>
      </div>
      <div className="share">
        <img className="post-footer-icon" src={shareIcon} alt="share" />
      </div>
    </div>
  );
};
