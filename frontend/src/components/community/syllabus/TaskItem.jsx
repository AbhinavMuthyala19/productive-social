
import { Card } from "../../ui/Card";
import "./TaskItem.css";
import { Checkbox } from "../../ui/Checkbox";


export const TaskItem = ({ title, taskId, completed, onToggle, disabled }) => {

  return (
    <Card className="task-card">
      <Checkbox
        completed={completed}
        onChange={(next) => onToggle(taskId, next)}
        disabled={disabled}
      />

      <div className="task-details">
        <h3 className="task-title">{title}</h3>
        {/* <span className="task-notes-link">
          <img src={notesIcon} alt="notes" />
          Notes linked
        </span> */}
      </div>

    </Card>
  );
};
