import { TrendingUp, UsersRound } from "lucide-react"
import { Badge } from "../ui/Badge"
import "./CommunityHeader.css"


export const CommunityHeader = ({ name, description, members}) => {
    return (
        <div className="community-header">
            <h2 className="community-title">{name}</h2>
            <p className="community-description">{description}</p>
            <div className="community-stats">
                <Badge variant="transparent-badge" label={members} icon={<UsersRound size={14} />} />
                <Badge variant="transparent-badge" label={`${150} posts`} icon={<TrendingUp size={15} />} />
            </div>
            <div className="community-details">
                <Badge label={"Intermediate"} />
                <Badge label={"100 days"} />
            </div>
        </div>
    )
}