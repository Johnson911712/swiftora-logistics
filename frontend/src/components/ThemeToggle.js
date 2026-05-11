import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
