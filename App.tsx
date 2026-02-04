import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import {
  Sun,
  Moon,
  ArrowUp,
  Check
} from './components/Icons';
import Modal from './components/Modal';
import InteractiveBackground from './components/InteractiveBackground';
import StudioPage from './components/Studio/StudioPage';
import HomePage from './components/Home/HomePage';
import { SiteContent, StudioContent } from './types';
import { EditorProvider } from './components/Editor/EditorContext';
import { EditorToolbar } from './components/Editor/EditorToolbar';



const FONT_OPTIONS = [
  { id: 'dmsans', label: 'DM Sans' },
  { id: 'figtree', label: 'Figtree' },
  { id: 'geist', label: 'Geist' },
  { id: 'ibmplex', label: 'IBM Plex Sans' },
  { id: 'sans', label: 'Inter' },
  { id: 'librefranklin', label: 'Libre Franklin' },
  { id: 'manrope', label: 'Manrope' },
  { id: 'monasans', label: 'Mona Sans' },
  { id: 'plusjakarta', label: 'Plus Jakarta Sans' },
  { id: 'publicsans', label: 'Public Sans' },
  { id: 'schibsted', label: 'Schibsted Grotesk' },
  { id: 'splinesans', label: 'Spline Sans' },
  { id: 'stacksans', label: 'Stack Sans Text' },
  { id: 'apple', label: 'System Default' },
];

const AdminRedirect: React.FC = () => {
  useEffect(() => {
    window.location.replace('/admin/');
  }, []);
  return null;
};

const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [studioContent, setStudioContent] = useState<StudioContent | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const t = new Date().getTime();
    fetch(`/content/pages/home.json?t=${t}`)
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error("Failed to load home content", err));

    fetch(`/content/pages/studio.json?t=${t}`)
      .then(res => res.json())
      .then(data => setStudioContent(data))
      .catch(err => console.error("Failed to load studio content", err));
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('site_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    }
    const hour = new Date().getHours();
    return (hour >= 19 || hour < 7) ? 'dark' : 'light';
  });

  const [userDarkTheme, setUserDarkTheme] = useState<string | null>(() => (typeof window !== 'undefined' ? localStorage.getItem('user_dark_theme') : null));
  const [userLightTheme, setUserLightTheme] = useState<string | null>(() => (typeof window !== 'undefined' ? localStorage.getItem('user_light_theme') : null));
  const [userFont, setUserFont] = useState<string | null>(() => (typeof window !== 'undefined' ? localStorage.getItem('user_font') : null));
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (content?.settings?.siteTitle) {
      document.title = currentPath === '/studio' ? "Tomi Abe Studio" : content.settings.siteTitle;
    }
  }, [content, currentPath]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('site_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleColorSelection = (mode: 'dark' | 'light', shade: string) => {
    if (mode === 'dark') {
      setUserDarkTheme(shade);
      localStorage.setItem('user_dark_theme', shade);
    } else {
      setUserLightTheme(shade);
      localStorage.setItem('user_light_theme', shade);
    }
  };

  const handleFontSelection = (font: string) => {
    setUserFont(font);
    localStorage.setItem('user_font', font);
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!content || !studioContent) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">Loading...</div>;
  }

  const activeDarkShade = userDarkTheme || content?.settings?.darkModeTheme || 'black';
  const activeLightShade = userLightTheme || content?.settings?.lightModeTheme || 'white';

  const getThemeClasses = () => {
    if (theme === 'dark') {
      switch (activeDarkShade) {
        case 'grey': return 'bg-[#18181b] text-zinc-200';
        case 'navy': return 'bg-[#0f172a] text-slate-200';
        case 'maroon': return 'bg-[#2a0a0a] text-rose-100';
        default: return 'bg-black text-zinc-100';
      }
    }
    switch (activeLightShade) {
      case 'ash': return 'bg-zinc-100 text-zinc-900';
      case 'ivory': return 'bg-[#fffbeb] text-stone-900';
      case 'sky': return 'bg-sky-50 text-sky-950';
      default: return 'bg-white text-zinc-900';
    }
  };

  const accentColor = content.settings?.accentColor || '#3b82f6';
  const fontFamily = userFont || content.settings?.fontFamily || 'sans';
  const themeClasses = getThemeClasses();

  return (
    <EditorProvider
      initialContent={content}
      initialStudioContent={studioContent}
      onContentUpdate={setContent}
      onStudioContentUpdate={setStudioContent}
    >
      <div className={`min-h-screen font-${fontFamily} transition-colors duration-500 relative ${themeClasses}`}>
        <style>{`::selection { background-color: ${accentColor}; color: #ffffff; }`}</style>
        <InteractiveBackground isDark={theme === 'dark'} />
        <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Appearance">
          <div className="space-y-12 pb-10">
            <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/5">
              <span className="font-medium opacity-90">Current Mode</span>
              <button onClick={toggleTheme} className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/5 dark:bg-zinc-800/80 hover:bg-black/10 dark:hover:bg-zinc-700 transition-colors border border-transparent dark:border-white/5">{theme === 'dark' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}<span className="text-sm font-semibold">{theme === 'dark' ? 'Dark' : 'Light'}</span></button>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6">Typography</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                {FONT_OPTIONS.map((f) => (
                  <button key={f.id} onClick={() => handleFontSelection(f.id)} className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all text-left ${fontFamily === f.id ? `border-blue-500 bg-black/5 dark:bg-white/5` : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                    <span className={`text-sm sm:text-base font-medium opacity-90 font-${f.id}`}>{f.label}</span>
                    {fontFamily === f.id && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-8">Light Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{ id: 'white', label: 'Pure White', hex: '#fff' }, { id: 'ash', label: 'Soft Ash', hex: '#f4f4f5' }, { id: 'ivory', label: 'Warm Ivory', hex: '#fffbeb' }, { id: 'sky', label: 'Cool Sky', hex: '#f0f9ff' }].map((s) => (
                    <button key={s.id} onClick={() => handleColorSelection('light', s.id)} className={`group flex flex-col items-center justify-start pt-5 pb-4 px-2 rounded-xl border-2 transition-all min-h-[110px] ${activeLightShade === s.id ? 'border-blue-500 bg-zinc-100 dark:bg-zinc-800' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}><div className="w-12 h-12 rounded-full shadow-inner border border-black/5 flex items-center justify-center transition-transform group-hover:scale-105 mb-auto" style={{ backgroundColor: s.hex }}>{activeLightShade === s.id && <Check className="w-6 h-6 text-zinc-900" />}</div><span className="text-[11px] font-semibold opacity-70 mt-3 text-center tracking-tight leading-none">{s.label}</span></button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-8">Dark Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{ id: 'black', label: 'True Black', hex: '#000' }, { id: 'grey', label: 'Charcoal', hex: '#18181b' }, { id: 'navy', label: 'Deep Navy', hex: '#0f172a' }, { id: 'maroon', label: 'Maroon', hex: '#2a0a0a' }].map((s) => (
                    <button key={s.id} onClick={() => handleColorSelection('dark', s.id)} className={`group flex flex-col items-center justify-start pt-5 pb-4 px-2 rounded-xl border-2 transition-all min-h-[110px] ${activeDarkShade === s.id ? 'border-blue-500 bg-zinc-100 dark:bg-zinc-800' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}><div className="w-12 h-12 rounded-full shadow-inner border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 mb-auto" style={{ backgroundColor: s.hex }}>{activeDarkShade === s.id && <Check className="w-6 h-6 text-white" />}</div><span className="text-[11px] font-semibold opacity-70 mt-3 text-center tracking-tight leading-none">{s.label}</span></button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-black/5 dark:border-white/5"><button onClick={() => setSettingsOpen(false)} className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:opacity-90 transition-opacity">Done</button></div>
          </div>
        </Modal>
        <button onClick={scrollToTop} className={`fixed bottom-6 right-6 p-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-full shadow-lg z-50 transition-all duration-300 lg:hidden flex items-center justify-center ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}><ArrowUp className="w-5 h-5 opacity-90" /></button>

        <Routes>
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/" element={<HomePage content={content} theme={theme} toggleTheme={toggleTheme} openSettings={() => setSettingsOpen(true)} />} />
          <Route path="/studio" element={<StudioPage content={studioContent} settings={content.settings} />} />
          {/* Placeholder for future dynamic pages */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6 text-center relative z-10">
              <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter mb-4 opacity-5 dark:opacity-10 pointer-events-none select-none">404</h1>
              <div className="space-y-2 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold">Page Not Found</h2>
                <p className="opacity-50 text-sm md:text-base">The path you're looking for doesn't exist or has been moved.</p>
              </div>
              <Link
                to="/"
                className="px-10 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/5 dark:shadow-white/5"
              >
                Go Home
              </Link>
            </div>
          } />
        </Routes>
        <EditorToolbar />
      </div>
    </EditorProvider>
  );
};

export default App;