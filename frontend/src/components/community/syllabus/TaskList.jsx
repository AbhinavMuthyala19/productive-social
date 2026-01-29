import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "./TaskItemSkeleton";
import "./TaskList.css"

export const TaskList = ({ syllabus, onToggle, disabled, loading }) => {
  if (loading) {
    return (
      <div className="task-list">
        {Array.from({ length: 3 }).map((_, i) => (
          <TaskItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="task-list">
      {syllabus?.map((task) => (
        <TaskItem
          key={task.taskId}
          title={task.title}
          taskId={task.taskId}
          completed={task.completed}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
