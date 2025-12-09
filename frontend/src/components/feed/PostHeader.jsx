import { Avatar } from "../ui/Avatar"
import { Badge } from "../ui/Badge"
import "./PostHeader.css"
import fireicon from "../../assets/icons/fire.svg"

export const PostHeader = ({user, createdAt, community, streak}) => {
    return (
        <div className="post-header">
            <Avatar alt="S" size={60}/>
            <div className="post-header-details">
                <div className="post-user-details">
                    <p className="post-user">{user}</p>
                    <p className="post-time"> • {createdAt}</p>
                </div>
                <div className="post-header-badges">
                    <Badge variant="community-badge" label={community}/>
                    <Badge variant="streak-badge" label={streak} icon={fireicon}/>
                </div>
            </div>
        </div>
    )
}