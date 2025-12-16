import { useNavigate, NavLink } from "react-router-dom"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { CommunityBanner } from "./CommunityBanner"
import { CommunityHeader } from "./CommunityHeader"
import "./CommunityCard.css"

export const CommunityCard = ({ data }) => {

    const navigate = useNavigate()
    const CATEGORY_COLORS = {
        1: "#2563eb",
        2: "#22c55e",
        3: "#9333ea",
        4: "#f97316",
        5: "#ef4444",
        6: "#14b8a6",
    };
    return (
        <Card variant="community-card">
            <CommunityBanner streak={data.streak} bannerColor={CATEGORY_COLORS[data.id]} />
            <CommunityHeader name={data.name} description={data.description} members={data.memberCount}/>
            <div className="community-card-footer">
                <Button
                    variant={`community-join-button ${data.joined ? "joined" : ""}`}
                    onClick={() => navigate(`/communities/${data.id}`)}
                >
                    {data.joined ? "View" : "Join Community"}
                </Button>
            </div>
        </Card>
    )
}