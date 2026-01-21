import { Card } from "../ui/Card";
import "./TaskItem.css";
import { Checkbox } from "../ui/Checkbox";
import notesIcon from "../../assets/icons/notes.svg";
import { Copy, Pencil } from "lucide-react";

export const TaskItem = ({title}) => {
  return (
    <Card className={"task-card"}>
      <Checkbox />
      <div className="task-details">
        <h3 className="task-title">{title}</h3>
        <span className="task-notes-link">
          <img src={notesIcon} alt="notes" />
          Notes linked
        </span>
      </div>
      <div className="task-options">
        <Copy size={20} />
        <Pencil size={20} />
      </div>
    </Card>
  );
};
