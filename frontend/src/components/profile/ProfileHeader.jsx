import { Pen } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import "./Profile.css";
import { Tooltip } from "../ui/Tooltip";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()
  return (
    <div className="profile-header">
      <Avatar src={profilePicture} alt={name} size={70} />
      <div className="profile-page-details">
        <div className="user-name">
          <h2>{name}</h2>
          <p>@{username}</p>
        </div>
        {bio && (
          <div className="user-bio">
            <p>{bio}</p>
          </div>
        )}
        <div className="profile-stats">
          <Badge variant={"blue-badge"} label={`${posts} posts`} />
          <Badge variant={"aqua-badge"} label={`${communities} communities`} />

          <Badge
            variant={"streak-badge"}
            label={`current streak - ${streak}`}
          />
          <Badge
            variant={"pink-badge"}
            label={`longest streak - ${longestStreak}`}
          />
        </div>
      </div>
      <div className="edit-profile">

      <Tooltip label={"Edit profile"}>
        <Button onClick={() => navigate("/accounts/edit-profile")} className="edit-profile-button">
          <Pen className="edit-profile-icon" size={20} />
        </Button>
      </Tooltip>
      </div>
    </div>
  );
};
