import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/TextArea"
import { Button } from "../ui/Button"
import "./CommentModal.css";
import closeIcon from "../../assets/icons/cross.svg"
import { useState } from "react";

export const CommentModal = ({ comments, onClose, isOpen }) => {
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState(comments);

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if (!comment.trim()) return;

        const newComment = {
            name: "Ajay",
            username: "@ajay",
            comment,
        };

        setCommentList(prev => [newComment, ...prev]);
        setComment("");
    };

    return (
        <Modal variant="large-modal" isOpen={isOpen} onClose={onClose}>
            <div className="comment-header">
                <h3>Comments</h3>
                <img onClick={onClose} src={closeIcon} alt="close" />
            </div>

            <div className="comments-list">
                {commentList.map((c, i) => (
                    <div key={i} className="comment-item">
                        <p className="name">
                            {c.name} <span>{c.username}</span>
                        </p>
                        <p className="text">{c.comment}</p>
                    </div>
                ))}
            </div>

            <div className="comment-input-container">
                <form onSubmit={(e) => {  // if this does NOT print → form isn't submitting through React
                    handleCommentSubmit(e);
                }}>
                    <TextArea
                        placeholder="Add your comment"
                        variant="comment-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button type="submit" variant="comment-button">Post</Button>
                </form>
            </div>
        </Modal>
    );
};
