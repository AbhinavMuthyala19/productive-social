import "./CommunityCard.css";
import "../header/CommunityHeader.css";
import "../header/CommunityBanner.css";
import { Card } from "../../ui/Card";
import { Skeleton } from "../../ui/Skeleton";

export const CommunityCardSkeleton = ({ view }) => {
  return (
    <div aria-hidden="true">
      <Card className={`community-card ${view === "list" ? "list" : ""}`}>
        {/* Banner */}
        {view === "grid" ? (
          <div className="community-banner">
            <div className="community-banner-icon">
              <Skeleton width="50px" height="50px" circle />
            </div>
            <Skeleton width="60px" height="20px" />
          </div>
        ) : (
          <div className="community-banner-list">
            <Skeleton width="70px" height="70px" circle />
          </div>
        )}

        {/* Header */}
        <div className={`community-header ${view === "list" ? "list" : ""}`}>
          <Skeleton width="60%" height="20px" />
          <Skeleton width="90%" height="14px" />

          <div className="community-stats">
            <Skeleton width="70px" height="20px" />
            <Skeleton width="70px" height="20px" />
          </div>
        </div>

        {/* Footer */}
        <div
          className={`community-card-footer ${view === "list" ? "list" : ""}`}
        >
          <Skeleton width={view === "grid" ? "100%" : "120px"} height="44px" />
        </div>
      </Card>
    </div>
  );
};
