import { Card } from "../ui/Card"
import { PostHeader } from "./PostHeader"
import { PostBody } from "./PostBody"
import { PostFooter } from "./PostFooter"
import { CommentModal } from "./CommentModal"
import { useState } from "react"


export const PostCard = ({ post }) => {

    const [showComments, setShowComments] = useState(false);

    return (
        <Card variant="post-card">
            <PostHeader
                user={"Sai Teja Chary"}
                createdAt={"2h ago"}
                community={"100 Days of ML"}
                streak={"Day 45"}
            />

            <PostBody content={{ heading: "Completed Neural Networks Chapter", post: "Finally understood backpropogation! Byuilt my first CNN from scratch. The math was challenging but breaking it down step by step really helped. Excited to move on to transfer learning next!" }} />
            <PostFooter likes={1}
             onOpenComments={()=>setShowComments(true)}
             comments={post.comments}
             />
            <CommentModal
                comments={post.comments}
                isOpen={showComments}
                onClose={() => setShowComments(false)}
            />
        </Card>
    )
}