import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "./Tooltip";
import "./BackButton.css";

export const BackButton = ({
  fallback = "/",      // safer than hardcoding
  label = "Go back",
  size = 30,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    const idx = window.history.state?.idx ?? 0;

    if (idx > 0) {
      navigate(-1);        // 🔒 stays inside app
    } else {
      navigate(fallback); // 🔒 never leaves app
    }
  };

  return (
    <Tooltip label={label}>
      <ArrowLeft
        className={`back-arrow ${className}`}
        size={size}
        role="button"
        tabIndex={0}
        onClick={handleBack}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleBack();
        }}
      />
    </Tooltip>
  );
};
