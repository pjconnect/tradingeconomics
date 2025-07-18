import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(undefined as any);

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {

        console.log('Initializing theme from localStorage or system preference...');

        // Initialize theme from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        console.log('No theme found in localStorage or system preference, defaulting to light theme.');
        return 'light'; // Default theme
    });

    // Apply theme to the <html> element and save to localStorage
    const applyTheme = useCallback((newTheme: string) => {
        console.log(`Applying theme: ${newTheme}`);
        document.body.setAttribute('data-theme', newTheme);
        console.log(document.body)
        localStorage.setItem('theme', newTheme);
        setThemeState(newTheme);
    }, []);

    // Apply initial theme on mount
    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    const value = {
        theme,
        setTheme: applyTheme, // Expose applyTheme as setTheme for convenience
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};