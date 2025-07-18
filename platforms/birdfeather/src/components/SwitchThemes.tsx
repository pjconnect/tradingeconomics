import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher = () => {
    const { setTheme } = useTheme();
    return (
        <nav>
            <ul className="flex space-x-4">
                <li>
                    <button
                        onClick={() => setTheme('light')}
                        className="w-8 h-8 rounded-full bg-zinc-100 hover:ring-2 ring-offset-2 ring-zinc-400 transition"
                        aria-label="Light theme"
                    />
                </li>
                <li>
                    <button
                        onClick={() => setTheme('dark')}
                        className="w-8 h-8 rounded-full bg-zinc-800 hover:ring-2 ring-offset-2 ring-zinc-400 transition"
                        aria-label="Dark theme"
                    />
                </li>
                <li>
                    <button
                        onClick={() => setTheme('fancy')}
                        className="w-8 h-8 rounded-full bg-purple-600 hover:ring-2 ring-offset-2 ring-zinc-400 transition"
                        aria-label="Fancy theme"
                    />
                </li>
            </ul>
        </nav>
    );
};
