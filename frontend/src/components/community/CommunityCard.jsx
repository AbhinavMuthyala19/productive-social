import { useNavigate, NavLink } from "react-router-dom"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { CommunityBanner } from "./CommunityBanner"
import { CommunityHeader } from "./CommunityHeader"
import "./CommunityCard.css"
import { useContext } from "react"
import { CommunityContext } from "../../context/CommunityContext"

export const CommunityCard = ({
    id,
    name,
    description,
    memberCount,
    joined,
    streak,
    view,
    className,
    clickable = true,
    onToggleJoin }) => {

    const { toggleJoinCommunity } = useContext(CommunityContext)

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
        <Card className={`community-card ${view === "list" ? "list" : ""} ${className}`}
            onClick={clickable ? () => navigate(`/communities/${id}`) : undefined}
        >
            <CommunityBanner streak={streak} bannerColor={CATEGORY_COLORS[id]} view={view} />
            <CommunityHeader name={name} description={description} members={memberCount} streak={streak} view={view} />
            <div className={`community-card-footer ${view === "list" ? "list" : ""}`}>
                <Button
                    className={`community-join-button ${joined ? "joined" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(`${id}: joined`)
                        onToggleJoin?.()
                        toggleJoinCommunity(id)
                    }}
                >
                    {joined ? "Joined" : "Join"}
                </Button>
            </div>
        </Card>
    )
}