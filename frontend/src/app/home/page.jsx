import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { PostCard } from "../../components/feed/PostCard"
import { NewPostButton } from "../../components/feed/NewPostButton"
import { PageHeader } from "../../components/layout/PageHeader"
import "../../App.css"
import { useContext } from "react"
import { PostContext } from "../../context/PostContext"

export const Home = () => {
    const { globalPosts, loading } = useContext(PostContext)


    if(loading) return <div>Loading.....</div>

    return (
        <PageContainer>
            <Navbar />
            <PageHeader title="Global Feed" description="Join challenge-based communities and stay accountable"
            ><NewPostButton /></PageHeader>
            <div className="main">
                {globalPosts.map(post => (
                    <PostCard key={post.postId} post={post} />
                ))}
            </div>
        </PageContainer>
    )
}