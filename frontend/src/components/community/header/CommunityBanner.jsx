import { Flame } from "lucide-react";
import robotIcon from "../../../assets/icons/robot.svg";
import { Badge } from "../../ui/Badge";
import "./CommunityBanner.css";

export const CommunityBanner = ({ id, streak, view }) => {
  const COLORS = [
    "#2563eb", // blue
    "#22c55e", // green
    "#9333ea", // purple
    "#f97316", // orange
    "#ef4444", // red
    "#14b8a6", // teal
  ];

  const bannerColor = COLORS[id % COLORS.length];
  const style = { backgroundColor: bannerColor };

  return view === "grid" ? (
    <div style={style} className="community-banner">
      <img
        className="community-banner-icon"
        src={robotIcon}
        alt=""
        aria-hidden="true"
      />
      {streak > 0 && (
        <Badge
          variant="white-badge"
          label={`${streak}d`}
          icon={<Flame size={14} />}
        />
      )}
    </div>
  ) : (
    <div
      style={{ backgroundColor: bannerColor }}
      className="community-banner-list"
    >
      <img
        className="community-banner-icon"
        src={robotIcon}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
};
