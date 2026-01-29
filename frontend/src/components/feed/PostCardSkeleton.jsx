import { Skeleton } from "../ui/Skeleton";
import "./PostCard.css";
import "./PostHeader.css";
import "./PostBody.css";
import "./PostFooter.css";
import { Card } from "../ui/Card";

export const PostCardSkeleton = () => {
  return (
    <Card className="post-card">
      <div className="post-header">
        <Skeleton width="70px" height="70px" circle={true} />
        <div className="post-user-details">
          <Skeleton width="100px" height="30px" />
          <Skeleton width="100px" height="30px" />
        </div>
      </div>
      <div className="post-body">
        <Skeleton width="70%" height="20px" />
        <Skeleton width="70%" height="20px" />
        <Skeleton width="40%" height="200px" />
        <Skeleton width="95%" height="30px" />
      </div>
      <div className="post-footer">
        <div className="left">
          <Skeleton width="40px" height="40px" circle />
          <Skeleton width="40px" height="40px" circle />

          <Skeleton width="40px" height="40px" circle />
          <Skeleton width="40px" height="40px" circle />
        </div>
        <div className="right">
          <Skeleton width="40px" height="40px" circle />
        </div>
      </div>
    </Card>
  );
};
