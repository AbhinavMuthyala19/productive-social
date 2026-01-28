import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import "./PostHeader.css";
import fireicon from "../../assets/icons/fire.svg";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";

export const PostHeader = ({
  user,
  createdAt,
  community,
  streak,
  displayCommunityBadge = false,
  displayStreakBadge = false,
  userNameClickable = true,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <div className="post-header">
      <Avatar alt={user.name} size={60} />
      <div className="post-header-details">
        <div className="post-user-details">
          <p 
          className="post-user"
          onClick={userNameClickable ? () => navigate(`/profile/${user.username}`) : undefined}
          >{user.username}</p>
          <p className="post-time"> • {createdAt}</p>
        </div>
        <div className="post-header-badges">
          {displayCommunityBadge && (
            <Badge
              onClick={() => navigate(`/communities/${community.id}`)}
              variant="community-badge"
              label={community.name}
            />
          )}
          {displayStreakBadge && streak > 0 && (
            <Badge variant="streak-badge" label={streak} icon={fireicon} />
          )}
        </div>
      </div>
      <EllipsisVertical className="menu-option" size={20} />
    </div>
  );
};
