import "./PostFooter.css"
import likeIcon from "../../assets/icons/like.svg"
import commentIcon from "../../assets/icons/comment.svg"
import shareIcon from "../../assets/icons/share.svg"
import { useState } from "react"
import unlikeIcon from "../../assets/icons/unlike.svg"



export const PostFooter = ({ likes, comments, onOpenComments }) => {

  const [like, setLike] = useState({
    likes: likes,
    clicked: false,
    icon: unlikeIcon
  });

  const handleLikes = () => {
    if (!like.clicked) {
      setLike({
        likes: like.likes + 1,
        clicked: true,
        icon: likeIcon
      });
    } else {
      setLike({
        likes: like.likes - 1,
        clicked: false,
        icon: unlikeIcon
      });
    }
  };

  return (
    <div className="post-footer">
      <div className="left">
        <div onClick={handleLikes} className="likes">
          <img className="post-footer-icon" src={like.icon} alt="like" />
          <p>{like.likes}</p>
        </div>
        <div onClick={onOpenComments} className="comments">
          <img className="post-footer-icon" src={commentIcon} alt="comment" />
          <p>{comments.length}</p>
        </div>
      </div>
      <div className="right">
        <img className="post-footer-icon" src={shareIcon} alt="share" />
      </div>
    </div>
  );
}
