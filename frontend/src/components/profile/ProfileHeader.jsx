import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import "./ProfileHeader.css";

export const ProfileHeader = ({
  name,
  username,
  bio,
  streak,
  longestStreak,
  posts,
  communities,
}) => {
  return (
    <div className="profile-header">
      <Avatar alt={name} size={70} />
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
          <Badge
            variant={"purple-badge"}
            label={`${communities} communities`}
          />

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
    </div>
  );
};
