// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ThemeContext = createContext();

// Create a custom hook to access the theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to provide the theme context to its children
export const ThemeProvider = ({ children }) => {
  // Initialize darkMode state from local storage, default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Function to toggle between dark and light modes
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Save the darkMode state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
