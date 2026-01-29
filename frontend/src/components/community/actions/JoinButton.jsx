import { Button } from "../../ui/Button";
import "./JoinButton.css";

export const JoinButton = ({ joined, onClick, className }) => {
  return (
    <Button
      className={`community-join-button ${className ?? ""} ${joined ? "joined" : ""}`}
      onClick={onClick}
    >
      {joined ? "Leave" : "Join"}
    </Button>
  );
};
