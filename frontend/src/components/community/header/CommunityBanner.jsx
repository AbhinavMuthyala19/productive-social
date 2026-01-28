import { Flame } from "lucide-react";
import robotIcon from "../../../assets/icons/robot.svg";
import { Badge } from "../../ui/Badge";
import "./CommunityBanner.css";

export const CommunityBanner = ({ streak, id, view }) => {
  const CATEGORY_COLORS = {
    1: "#2563eb",
    2: "#22c55e",
    3: "#9333ea",
    4: "#f97316",
    5: "#ef4444",
    6: "#14b8a6",
  };
  const bannerColor = CATEGORY_COLORS[id];
  return view === "grid" ? (
    <div style={{ backgroundColor: bannerColor }} className="community-banner">
      <img
        className="community-banner-icon"
        src={robotIcon}
        alt="banner-icon"
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
        alt="banner-icon"
      />
    </div>
  );
};
