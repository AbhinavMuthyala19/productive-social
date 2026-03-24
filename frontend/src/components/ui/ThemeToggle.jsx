import { useTheme } from "../../context/ThemeContext";
import { Button } from "./Button"
import { Moon, Sun } from "lucide-react";
import "./ThemeToggle.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
};
