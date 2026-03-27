import { X } from "lucide-react";
import { Button } from "./Button";
import "./CloseButton.css"

export const CloseButton = ({ onClick }) => {
  return (
    <Button variant="transparent-button" onClick={onClick}>
      <X className="close-icon" size={20} />
    </Button>
  );
};