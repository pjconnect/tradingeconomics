import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(undefined as any);

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
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
        return 'light'; // Default theme
    });

    // Apply theme to the <html> element and save to localStorage
    const applyTheme = useCallback((newTheme: string) => {
        document.body.setAttribute('data-theme', newTheme);
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