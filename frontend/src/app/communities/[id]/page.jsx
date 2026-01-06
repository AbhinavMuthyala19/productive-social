import { useEffect, useState } from "react"
import { CommunityBanner } from "../../../components/community/CommunityBanner"
import { CommunityCard } from "../../../components/community/CommunityCard"
import { CommunityHeader } from "../../../components/community/CommunityHeader"
import { Navbar } from "../../../components/layout/Navbar"
import { PageContainer } from "../../../components/layout/PageContainer"
import { PageHeader } from "../../../components/layout/PageHeader"
import { Tabs } from "../../../components/ui/Tabs"
import "../Communities.css"
import { getCommunity } from "../../../lib/api"
import { useParams } from "react-router-dom"

export const CommunityPage = () => {
    const [community, setCommunity] = useState(null)
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState("Feed")
    const tabs = ["Feed", "Syllabus", "Notes"]


    useEffect(() => {
        fetchCommunity()
    }, [id]);

    const fetchCommunity = async () => {
        try {
            const response = await getCommunity(id)
            console.log(response.data)
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


    if (loading || !community) return <div>Loading.......</div>
    return (
        <PageContainer>
            <Navbar />
            <PageHeader className="community-page-header">
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
        </PageContainer>
    )
}