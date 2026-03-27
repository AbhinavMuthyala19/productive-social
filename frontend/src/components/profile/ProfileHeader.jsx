import { Pen } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import "./Profile.css";
import { Tooltip } from "../ui/Tooltip";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const ProfileHeader = ({
  name,
  username,
  bio,
  profilePicture,
  streak,
  longestStreak,
  posts,
  communities,
}) => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const isOwnProfile = user?.username === username;

  return (
    <div className="profile-header">
      <Avatar className={"profile-pic"} src={profilePicture} alt={name} />
      <div className="profile-page-details">
        <div className="user-name">
          <h2>{name}</h2>
          <p>@{username}</p>
        </div>
        <div className="profile-stats">
          <Button
            onClick={() => navigate("/profile?tab=Feed")}
            variant={"stats-button"}
          >
            {posts} {posts === 1 ? "post" : "posts"}
          </Button>
          <Button
            onClick={() => navigate("/profile?tab=Communities")}
            variant={"stats-button"}
          >
            {communities} {communities === 1 ? "community" : "communities"}
          </Button>
          <Button variant={"stats-button"}>
            longest streak {longestStreak}
          </Button>
        </div>
        {bio && (
          <div className="user-bio">
            <p>{bio}</p>
          </div>
        )}
      </div>
      {isOwnProfile && (
        <div className="edit-profile">
          <Tooltip label={"Edit profile"}>
            <Button
              onClick={() => navigate("/accounts/edit-profile")}
              className="edit-profile-button"
            >
              <Pen className="edit-profile-icon" size={20} />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
