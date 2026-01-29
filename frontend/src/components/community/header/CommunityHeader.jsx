import { TrendingUp, UsersRound } from "lucide-react";
import { Badge } from "../../ui/Badge";
import "./CommunityHeader.css";
import fireIcon from "../../../assets/icons/fire.svg";

export const CommunityHeader = ({
  name,
  description,
  members,
  streak,
  view,
}) => {
  return (
    <div className={`community-header ${view === "list" ? "list" : ""}`}>
      <h2 className="community-title">{name}</h2>
      <p className="community-description">{description}</p>
      <div className="community-stats">
        <Badge
          variant="transparent-badge"
          label={members}
          icon={<UsersRound size={14} />}
        />
        {/* <Badge
          variant="transparent-badge"
          label={`${150} posts`}
          icon={<TrendingUp size={15} />}
        /> */}
        {view === "list" && streak > 0 && (
          <Badge
            variant="streak-badge"
            label={`${streak} day${streak > 1 ? "s" : ""} streak`}
            icon={fireIcon}
          />
        )}
      </div>
    </div>
  );
};
