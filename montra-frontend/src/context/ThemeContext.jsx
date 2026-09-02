import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('montra_theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Light / Dark class remove karke target theme add karo
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Theme attribute add karne se Tailwind selector reliably match karta hai
    root.setAttribute('data-theme', theme);
    localStorage.setItem('montra_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};