import { Skeleton } from "../ui/Skeleton";
import "./PostCard.css";
import "./PostHeader.css";
import "./PostBody.css";
import "./PostFooter.css";
import { Card } from "../ui/Card";

export const PostCardSkeleton = () => {
  return (
    <Card className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <Skeleton variant="circle" width="40px" height="40px" />

        <div className="post-user-details">
          <Skeleton variant="text" width="120px" height="14px" />
          <Skeleton variant="text" width="80px" height="12px" />
        </div>
      </div>

      {/* BODY */}
      <div className="post-body">
        <Skeleton variant="text" width="60%" height="18px" />

        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="55%" />
        <Skeleton variant="text" width="50%" />
      </div>

      {/* FOOTER */}
      <div className="post-footer">
        <div className="left">
          <Skeleton variant="circle" width="32px" height="32px" />
          <Skeleton variant="circle" width="32px" height="32px" />
        </div>

        <div className="right">
          <Skeleton variant="circle" width="32px" height="32px" />
        </div>
      </div>
    </Card>
  );
};
