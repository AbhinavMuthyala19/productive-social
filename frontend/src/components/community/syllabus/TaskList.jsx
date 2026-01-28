import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "./TaskItemSkeleton";

export const TaskList = ({ syllabus, onToggle, disabled, loading }) => {
  if (loading) {
    return Array.from({ length: 3 }).map((_, i) => 
    <TaskItemSkeleton key={i}/>);
  }
  return syllabus.map((task) => (
    <TaskItem
      key={task.taskId}
      title={task.title}
      taskId={task.taskId}
      completed={task.completed}
      onToggle={onToggle}
      disabled={disabled}
    />
  ));
};
