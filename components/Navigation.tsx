import React, { useState, useEffect } from 'react';
import { Swatch, Moon, Sun } from './Icons';

interface NavigationProps {
  currentPath: string; // '/' or '/studio'
  onNavigate: (path: string) => void;
  toggleTheme: () => void;
  openSettings: () => void;
  isDark: boolean;
  studioName?: string;
  links?: { label: string; url: string }[]; // Optional links for Studio nav
}

const Navigation: React.FC<NavigationProps> = ({
  currentPath,
  onNavigate,
  toggleTheme,
  openSettings,
  isDark,
  studioName = "Tomi Abe Studio",
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isStudio = currentPath === '/studio';

  // Desktop Nav Items
  const navItems = isStudio
    ? [
      { label: 'Approach', id: 'approach' },
      { label: 'Services', id: 'services' },
      { label: 'Work', id: 'work' },
      { label: 'About', id: 'about' },
      { label: 'Contact', id: 'contact' },
    ]
    : []; // Personal site has sidebar nav, so no top nav items usually

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

          {/* Logo Area */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => isStudio ? window.location.reload() : onNavigate('/studio')}>
            {isStudio ? (
              <span className="font-bold text-lg tracking-tight hover:opacity-70 transition-opacity">
                {studioName}
              </span>
            ) : (
              // On personal site, maybe just a back to studio link or nothing if sidebar handles it
              <span className="font-medium text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors lg:hidden">
                Tomi Abe
              </span>
            )}
          </div>

          {/* Desktop Links (Studio Only) */}
          {isStudio && (
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Switcher Link Removed */}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-70 hover:opacity-100"
            >
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={openSettings}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-70 hover:opacity-100"
            >
              <Swatch className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle (Studio Only) */}
            {isStudio && (
              <button
                className="md:hidden p-2 ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current mt-1 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (Studio Only) */}
      {isStudio && mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white dark:bg-black pt-24 px-6 animate-fadeIn md:hidden">
          <div className="flex flex-col gap-6 text-center">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="text-2xl font-light"
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full my-4"></div>
            <button onClick={() => { onNavigate('/'); setMobileMenuOpen(false); }} className="opacity-60">
              Switch to Personal Site
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;