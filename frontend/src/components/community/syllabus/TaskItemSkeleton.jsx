import { Card } from "../../ui/Card";
import "./TaskItem.css";
import { Skeleton } from "../../ui/Skeleton";

export const TaskItemSkeleton = () => {
  return (
    <div aria-hidden="true">
      <Card className="task-card">
        <Skeleton width="30px" height="30px" circle />

        <div className="task-details">
          <Skeleton width="30%" />
          <Skeleton width="20%" />
        </div>
      </Card>
    </div>
  );
};
