import "./PostFooter.css";
import likeIcon from "../../assets/icons/like.svg";
import commentIcon from "../../assets/icons/comment.svg";
import shareIcon from "../../assets/icons/share.svg";
import unlikeIcon from "../../assets/icons/unlike.svg";

export const PostFooter = ({ post, onOpenComments, onToggleLike }) => {
  const likeIconSrc = post.likedByCurrentUser ? likeIcon : unlikeIcon;

  return (
    <div className="post-footer">
      <div className="left">
        <div onClick={onToggleLike} className="likes">
          <img className="post-footer-icon" src={likeIconSrc} alt="like" />
          <p>{post.likesCount}</p>
        </div>
        <div onClick={onOpenComments} className="comments">
          <img className="post-footer-icon" src={commentIcon} alt="comment" />
          <p>{post.commentsCount}</p>
        </div>
      </div>
      <div className="right">
        <img className="post-footer-icon" src={shareIcon} alt="share" />
      </div>
    </div>
  );
};
