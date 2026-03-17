import { Card } from "../../ui/Card";
import "./TaskItem.css";
import { Checkbox } from "../../ui/Checkbox";
import { Button } from "../../ui/Button";

export const TaskItem = ({
  title,
  taskId,
  completed,
  onToggle,
  onViewNotes,
  disabled,
}) => {
  return (
    <Card className="task-card">
      <Checkbox
        completed={completed}
        onChange={(next) => onToggle(taskId, next)}
        disabled={disabled}
      />

      <div className="task-details">
        <h3 className="task-title">{title}</h3>
      </div>

      <Button
        className={"task-card-button"}
        onClick={() => onViewNotes(taskId)}
      >
        View Notes
      </Button>
    </Card>
  );
};
