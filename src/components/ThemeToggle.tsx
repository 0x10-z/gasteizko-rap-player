// ThemeToggle.tsx
import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    toggleTheme();
  };

  return (
    <Switch
      onChange={handleThemeChange}
      checked={theme === "dark"}
      onColor="#282c35"
      offColor="#f0f0f0"
      checkedIcon={
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <FontAwesomeIcon icon={faSun} color="#ffc107" size="sm" />
        </div>
      }
      uncheckedIcon={
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <FontAwesomeIcon icon={faMoon} color="#333" size="sm" />
        </div>
      }
      height={24}
      width={48}
      offHandleColor="#fff"
    />
  );
};

export default ThemeToggle;
