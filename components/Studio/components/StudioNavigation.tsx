import React, { useState } from 'react';
import { Menu, X, Moon, Sun } from './StudioIcons';
import { Theme, NavLink } from '../types';

interface NavigationProps {
    theme: Theme;
    toggleTheme: () => void;
    links: NavLink[];
}

const StudioNavigation: React.FC<NavigationProps> = ({ theme, toggleTheme, links }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Fallback links if none provided
    const navLinks = links && links.length > 0 ? links : [
        { label: 'Approach', url: '#approach' },
        { label: 'Services', url: '#services' },
        { label: 'Work', url: '#work' },
        { label: 'About', url: '#about' },
        { label: 'Contact', url: '#contact' },
    ];

    // Using thumbnail endpoint which is more reliable for embedding than export=view
    const lightLogo = "https://drive.google.com/thumbnail?id=11p7VJl8_09uZXCwOA66oeEivr7K3CqVP&sz=w500";
    const darkLogo = "https://drive.google.com/thumbnail?id=1-1T2UCLKWpyXrq5LWcJDY6eEDfS_Nr3Y&sz=w500";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="absolute inset-0 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-500"></div>

            <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo Section */}
                <a href="#" className="flex items-center gap-3 z-50 group">
                    {/* Logo Image: Visible ONLY on mobile (md:hidden) */}
                    <div className="relative flex items-center justify-center md:hidden" style={{ height: '25px' }}>
                        <img
                            key={theme}
                            src={theme === Theme.DARK ? darkLogo : lightLogo}
                            alt="Tomi Abe Studio Logo"
                            className="w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            style={{ height: '25px' }}
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    {/* Text: Hidden on mobile (hidden), visible ONLY on desktop (md:block) */}
                    <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white hidden md:block">
                        Tomi Abe Studio
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                        aria-label="Toggle Theme"
                    >
                        {theme === Theme.DARK ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 md:hidden z-50">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                    >
                        {theme === Theme.DARK ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-900 dark:text-white"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <div
                className={`fixed inset-0 bg-white dark:bg-black z-40 flex flex-col pt-24 px-6 md:hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="flex flex-col space-y-6">
                    {navLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default StudioNavigation;
