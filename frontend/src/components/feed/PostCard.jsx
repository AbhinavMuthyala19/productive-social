import { Card } from "../ui/Card"
import { PostHeader } from "./PostHeader"
import { PostBody } from "./PostBody"
import { PostFooter } from "./PostFooter"
import { CommentModal } from "./CommentModal"
import { useContext, useState } from "react"
import "./PostCard.css"


export const PostCard = ({ post, onLike, onUnlike }) => {

    const [showComments, setShowComments] = useState(false);

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
                user={post.user.username}
                createdAt={timeAgo(post.createdAt)}
                community={post.community.name}
                streak={`Day ${post.user.streak}`}
            />

            <PostBody 
                content={{ post: post.content  }} 
                image={`${import.meta.env.VITE_API_URL}${post.images[0].imageUrl}`}    
            />
            <PostFooter 
                post={post}
                onOpenComments={() => setShowComments(true)}
                onLike={onLike}
                onUnlike={onUnlike}
            />
            <CommentModal
                comments={post.comments}
                isOpen={showComments}
                onClose={() => setShowComments(false)}
            />
        </Card>
    )
}