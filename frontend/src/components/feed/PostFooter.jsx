import "./PostFooter.css"
import likeIcon from "../../assets/icons/like.svg"
import commentIcon from "../../assets/icons/comment.svg"
import shareIcon from "../../assets/icons/share.svg"
import { useContext, useState } from "react"
import unlikeIcon from "../../assets/icons/unlike.svg"
import { PostContext } from "../../context/PostContext"



export const PostFooter = ({ post, onOpenComments, onLike, onUnlike }) => {

  const { likePost, unlikePost } = useContext(PostContext)

  const likeIconSrc = post.likedByCurrentUser ? likeIcon : unlikeIcon;


  const handleLike = () => {
    if (onLike && onUnlike) {
      post.likedByCurrentUser
        ? onUnlike(post.postId)
        : onLike(post.postId)
      return
    }
    post.likedByCurrentUser
      ? unlikePost(post.postId)
      : likePost(post.postId);
  };

  return (
    <div className="post-footer">
      <div className="left">
        <div onClick={handleLike} className="likes">
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
}
