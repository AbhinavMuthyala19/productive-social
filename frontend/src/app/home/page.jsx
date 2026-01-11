import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { PostCard } from "../../components/feed/PostCard"
import { NewPostButton } from "../../components/feed/NewPostButton"
import { PageHeader } from "../../components/layout/PageHeader"
import "../../App.css"
import { useContext } from "react"
import { PostContext } from "../../context/PostContext"
import { PostCardSkeleton } from "../../components/feed/PotCardSkeleton"
import { CommunityContext } from "../../context/CommunityContext"

export const Home = () => {
    const { globalPosts, loading, handleCommentAdded } = useContext(PostContext)
    const { communities } = useContext(CommunityContext)

    if (loading) return <div>Loading.....</div>

    const joinedCommunityIds = new Set(
        communities.filter(c => c.joined).map(c => c.id)
    );

    const joinedPosts = globalPosts.filter(
        post => joinedCommunityIds.has(post.community.id)
    );

    return (
        <PageContainer>
            <Navbar />
            <PageHeader title="Global Feed" description="Join challenge-based communities and stay accountable"
            ><NewPostButton /></PageHeader>
            <div className="main">
                {joinedPosts.length === 0
                    ? <div>No posts yet from your communities</div>
                    :
                    loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))
                        : joinedPosts.map(post => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                onCommentAdded={handleCommentAdded}
                            />
                        ))
                }

            </div>
        </PageContainer>
    )
}