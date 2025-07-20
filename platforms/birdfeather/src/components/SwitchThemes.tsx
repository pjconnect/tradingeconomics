import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    
    // Define theme button appearance
    const getThemeButton = (themeName: string, bgColor: string) => {
        const isActive = theme === themeName;
        return (
            <li>
                <button
                    onClick={() => {
                        setTheme(themeName);
                        setIsExpanded(false);
                    }}
                    className={`w-8 h-8 border ${isActive ? 'border-2' : 'border'} border-accent rounded-full ${bgColor} hover:ring-2 ring-offset-2 ring-zinc-400 transition`}
                    aria-label={`${themeName} theme`}
                />
            </li>
        );
    };
    
    return (
        <nav>
            {isExpanded ? (
                <ul className="flex space-x-4">
                    {getThemeButton('light', 'bg-zinc-100')}
                    {getThemeButton('dark', 'bg-zinc-800')}
                    {getThemeButton('fancy', 'bg-purple-600')}
                </ul>
            ) : (
                <button
                    onClick={toggleExpand}
                    className="w-8 h-8 border border-accent rounded-full hover:ring-2 ring-offset-2 ring-zinc-400 transition"
                    style={{ 
                        background: theme === 'light' ? '#f4f4f5' : 
                                  theme === 'dark' ? '#27272a' : 
                                  '#9333ea' 
                    }}
                    aria-label={`Current theme: ${theme}, click to change`}
                />
            )}
        </nav>
    );
};
