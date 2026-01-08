import { useEffect, useState } from "react"
import { CommunityBanner } from "../../../components/community/CommunityBanner"
import { CommunityCard } from "../../../components/community/CommunityCard"
import { CommunityHeader } from "../../../components/community/CommunityHeader"
import { Navbar } from "../../../components/layout/Navbar"
import { PageContainer } from "../../../components/layout/PageContainer"
import { PageHeader } from "../../../components/layout/PageHeader"
import { Tabs } from "../../../components/ui/Tabs"
import "../Communities.css"
import { getCommunity, getCommunityPosts, likePosts, unlikePosts } from "../../../lib/api"
import { useNavigate, useParams } from "react-router-dom"
import backIcon from "../../../assets/icons/backarrow.svg"
import { PostCard } from "../../../components/feed/PostCard"

export const CommunityPage = () => {
    const [community, setCommunity] = useState(null)
    const [posts, setPosts] = useState([])
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [active, setActive] = useState("Feed")
    const tabs = ["Feed", "Syllabus", "Notes"]
    const navigate = useNavigate()


    useEffect(() => {
        fetchCommunity();
    }, [id]);

    useEffect(() => {
        if (active === "Feed" && posts.length === 0) {
            fetchCommunityPosts()
        }

        // if (active === "Syllabus" && !syllabus) {
        //     fetchCommunitySyllabus()
        // }

        // if (active === "Notes" && notes.length === 0) {
        //     fetchCommunityNotes()
        // }
    }, [active, id])


    const fetchCommunity = async () => {
        try {
            setLoading(true)
            const response = await getCommunity(id)
            // console.log(response.data)
            setCommunity(response.data)
        } finally {
            setLoading(false)
        }
    }
    const handleToggleJoin = () => {
        setCommunity(prev => ({
            ...prev,
            joined: !prev.joined,
        }));
    };

    const fetchCommunityPosts = async () => {
        try {
            setLoading(true)
            const response = await getCommunityPosts(id)
            console.log("posts:", response.data)
            setPosts(response.data)
        } catch (error) {
            console.error(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async (postId) => {
        setPosts(prev =>
            prev.map(post =>
                post.postId === postId
                    ? {
                        ...post,
                        likedByCurrentUser: true,
                        likesCount: post.likesCount + 1
                    }
                    : post
            )
        );

        try {
            await likePosts(postId);
        } catch {
            fetchCommunityPosts();
        }
    };

    const handleUnlike = async (postId) => {
        setPosts(prev =>
            prev.map(post =>
                post.postId === postId
                    ? {
                        ...post,
                        likedByCurrentUser: false,
                        likesCount: post.likesCount - 1
                    }
                    : post
            )
        );

        try {
            await unlikePosts(postId);
        } catch {
            fetchCommunityPosts();
        }
    };




    if (loading || !community) return <div>Loading.......</div>
    return (
        <PageContainer>
            <Navbar />
            <PageHeader className="community-page-header">
                <img className="backarrow" onClick={() => navigate(-1)} src={backIcon} alt="back" />
                <CommunityCard
                    className="community-details"
                    id={community.id}
                    view="list"
                    name={community.name}
                    description={community.description}
                    memberCount={community.totalMembers}
                    joined={community.joined}
                    clickable={false}
                    onToggleJoin={handleToggleJoin}

                />
                <div className="community-tabs">
                    <Tabs
                        tabs={tabs}
                        active={active}
                        onChange={setActive}
                    />
                </div>
            </PageHeader>
            <div className="main">
                {active === "Feed" && posts.map(post => (
                    <PostCard
                        key={post.postId}
                        post={post}
                        onLike={handleLike}
                        onUnlike={handleUnlike}
                    />
                ))}
            </div>
        </PageContainer>
    )
}