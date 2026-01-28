import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import "./CommentModal.css";
import closeIcon from "../../assets/icons/cross.svg";
import { useEffect, useRef, useState } from "react";
import { getPostComments, postComments } from "../../lib/api";
import { CommentItem } from "./CommentItem";

export const CommentModal = ({ postId, onClose, isOpen, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const commentsTopRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getPostComments(postId);
      setComments(res.data);
      console.log(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await postComments({
        postId,
        content: comment,
        parentCommentId: replyTo,
      });

      setComments((prev) =>
        replyTo ? addReply(prev, replyTo, res.data) : [res.data, ...prev],
      );
      commentsTopRef.current?.scrollIntoView({
        behavior: "smooth",
      });

      setComment("");
      setReplyTo(null);

      // 🔑 tell feed to increment commentsCount
      onCommentAdded?.(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const addReply = (comments, parentId, reply) => {
    return comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [reply, ...(c.replies || [])] }
        : {
            ...c,
            replies: c.replies
              ? addReply(c.replies, parentId, reply)
              : c.replies,
          },
    );
  };

  return (
    <Modal className="comment-modal" isOpen={isOpen} onClose={onClose}>
      <div className="comment-header">
        <h3>Comments</h3>
        <img onClick={onClose} src={closeIcon} alt="close" />
      </div>

      <div className="comments-list">
        <div ref={commentsTopRef} />

        {loading ? (
          <p>Loading...</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onReply={(comment) => {
                setReplyTo(comment.id);
                setComment(`@${comment.username} `);
              }}
            />
          ))
        )}
      </div>

      <div className="comment-input-container">
        <form
          onSubmit={(e) => {
            // if this does NOT print → form isn't submitting through React
            handleCommentSubmit(e);
          }}
        >
          <TextArea
            placeholder="Add your comment"
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" variant="comment-button">
            Post
          </Button>
        </form>
      </div>
    </Modal>
  );
};
