import React from "react";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-fab"
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Icon name={theme === "light" ? "moon" : "sun"} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggleButton;
