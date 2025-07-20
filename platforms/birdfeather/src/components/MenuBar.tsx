import React from 'react';
import { NavLink } from 'react-router';
import { ThemeSwitcher } from './SwitchThemes';

const MenuBar: React.FC = () => {
    return (
        <div className="bg-primary-500 p-4">
            <div className="flex gap-4">

                <nav className="flex justify-between items-center">
                    <ul className="flex space-x-6">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-default font-bold border-b-2 border-primary pb-1'
                                        : 'text-default hover:text-secondary-300 transition-colors duration-200'
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/search"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-default font-bold border-b-2 border-primary pb-1'
                                        : 'text-default hover:text-secondary-300 transition-colors duration-200'
                                }
                            >
                                Search
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-default font-bold border-b-2 border-primary pb-1'
                                        : 'text-default hover:text-secondary-300 transition-colors duration-200'
                                }
                            >
                                About
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <ThemeSwitcher />

            </div>
        </div>
    );
};

export default MenuBar;