import React from 'react';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => (
  <button 
    className="theme-toggle"
    onClick={toggleTheme}
    aria-label="Toggle Dark Mode"
  >
    {isDarkMode ? '☀️' : '🌙'}
  </button>
);

export default ThemeToggle;