import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const icon = theme === "light" ? "\uD83C\uDF19" : "\u2600\uFE0F";

  return (
    <button
      className="theme-fab"
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
};

export default ThemeToggleButton;
