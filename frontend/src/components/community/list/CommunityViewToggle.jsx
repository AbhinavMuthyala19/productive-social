import { Grid, List } from "lucide-react";
import "./CommunityViewToggle.css";
import { Button } from "../../ui/Button";

export const CommunityViewToggle = ({ view, setView }) => {
  return (
    <div className="card-view" role="group" aria-label="View toggle">
      <Button
        variant="transparent-button"
        aria-pressed={view === "grid"}
        aria-label="Grid View"
        onClick={() => setView("grid")}
      >
        <Grid className="grid-icon" size={20} color={view === "grid" ? "#2563eb" : "#111113"} />
      </Button>
      <Button
        variant={"transparent-button"}
        aria-pressed={view === "list"}
        aria-label="List View"
        onClick={() => setView("list")}
      >
        <List className="list-icon" size={20} color={view === "list" ? "#2563eb" : "#111113"} />
      </Button>
    </div>
  );
};
