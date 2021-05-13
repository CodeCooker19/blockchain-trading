import React, { useState, useEffect } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

export default () => {
  const [isDarkMode, setIsDarkMode] = useState(() => false);
  useEffect(() => {

    const darkMode = localStorage.getItem('darkMode');
    const isDark = darkMode === 'true' ? true : false;
    setIsDarkMode(isDark)
  }, []);

  function handleChange() {

    localStorage.setItem("darkMode", isDarkMode ? "false" : "true");
    window.location.reload(true);
  }

  return (
    <div style={{ alignSelf: "center", paddingTop: "45px" }}>
      <DarkModeToggle
        onChange={handleChange}
        checked={isDarkMode}
        size={70}
      />
    </div>
  );
};