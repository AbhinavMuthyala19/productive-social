import { Skeleton } from "../ui/Skeleton";
import "./Profile.css";

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="profile-header">
      {/* Avatar */}
      <Skeleton
        variant="circle"
        width="70px"
        height="70px"
        className="profile-pic"
      />

      <div className="profile-page-details">
        {/* Name + Username */}
        <div className="user-name">
          <Skeleton variant="text" width="180px" height="20px" />
          <Skeleton variant="text" width="120px" height="14px" />
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <Skeleton width="80px" height="30px" />
          <Skeleton width="100px" height="30px" />
          <Skeleton width="120px" height="30px" />
        </div>

        {/* Bio */}
        <div className="user-bio">
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>

      {/* Edit Button */}
      <div className="edit-profile">
        <Skeleton width="40px" height="40px" />
      </div>
    </div>
  );
};