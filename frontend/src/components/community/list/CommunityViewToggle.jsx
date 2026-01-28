import { Grid, List } from "lucide-react";
import "./CommunityViewToggle.css";

export const CommunityViewToggle = ({ view, setView }) => {
  return (
    <div className="card-view">
      <Grid
        size={20}
        style={{ cursor: "pointer" }}
        onClick={() => setView("grid")}
        color={view === "grid" ? "#2563eb" : "#111113"}
      />
      <List
        size={20}
        style={{ cursor: "pointer" }}
        onClick={() => setView("list")}
        color={view === "list" ? "#2563eb" : "#111113"}
      />
    </div>
  );
};
