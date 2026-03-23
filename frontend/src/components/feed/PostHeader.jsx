import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import "./PostHeader.css";
import fireIcon from "../../assets/icons/fire.svg";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { AuthContext } from "../../context/AuthContext";

export const PostHeader = ({
  user,
  createdAt,
  community,
  streak,
  displayCommunityBadge = false,
  displayStreakBadge = false,
  userNameClickable = true,
  onDelete,
  children,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user: currentUser} = useContext(AuthContext);
  const isOwner = currentUser?.id === user?.id
  const goToProfile = () => navigate(`/profile/${user.username}`);
  const goToCommunity = () => navigate(`/communities/${community.id}`);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="post-header">
      <Avatar src={user.profilePicture} alt={user.name} size={60} />
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
      <div className="menu-wrapper" ref={menuRef}>
        <EllipsisVertical
          className="menu-option"
          size={20}
          onClick={(e) => {
            e.stopPropagation(); // important
            setMenuOpen((prev) => !prev);
          }}
        />

        {menuOpen && (
          <div className="post-menu">
            {isOwner && <Button
              className="post-menu-item delete"
              onClick={() => {
                onDelete?.();
                setMenuOpen(false);
              }}
            >
              Delete
            </Button>}
          </div>
        )}
      </div>
    </div>
  );
};
