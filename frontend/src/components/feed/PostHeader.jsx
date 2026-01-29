import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import "./PostHeader.css";
import fireIcon from "../../assets/icons/fire.svg";
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

  const goToProfile = () => navigate(`/profile/${user.username}`);
  const goToCommunity = () => navigate(`/communities/${community.id}`)

  if (!user) return null;

  return (
    <div className="post-header">
      <Avatar alt={user.name} size={60} />
      <div className="post-header-details">
        <div className="post-user-details">
          <p
            className="post-user"
            onClick={userNameClickable ? goToProfile : undefined}
          >
            {user.username}
          </p>
          <p className="post-time"> • {createdAt}</p>
        </div>
        <div className="post-header-badges">
          {displayCommunityBadge && (
            <Badge
              onClick={goToCommunity}
              variant="community-badge"
              label={community.name}
            />
          )}
          {displayStreakBadge && streak > 0 && (
            <Badge variant="streak-badge" label={streak} icon={fireIcon} />
          )}
        </div>
      </div>
      <EllipsisVertical className="menu-option" size={20} />
    </div>
  );
};
