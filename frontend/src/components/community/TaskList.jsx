import { TaskItem } from "./TaskItem";

export const TaskList = ({ syllabus, onToggle }) => {
  return syllabus.map((task) => (
    <TaskItem
      key={task.taskId}
      title={task.title}
      taskId={task.taskId}
      completed={task.completed}
      onToggle={onToggle}
    />
  ));
};
