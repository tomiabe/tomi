import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  ArrowTopRightOnSquare, 
  ArrowRight, 
  ArrowUpRight,
  Sun, 
  Moon, 
  XMark,
  Twitter,
  Instagram,
  LinkedIn,
  Envelope,
  Medium,
  Substack,
  ArrowUp,
  Swatch,
  Check
} from './components/Icons';
import Modal from './components/Modal';
import Navigation from './components/Navigation';
import InteractiveBackground from './components/InteractiveBackground';
import StudioPage from './components/Studio/StudioPage';
import { SiteContent, SocialPlatform, SiteSettings, StudioContent } from './types';
import personalData from './content/data'; 
import studioDataStatic from './content/studio_data';

// --- Types ---
type SectionId = 'intro' | 'who' | 'build' | 'learning' | 'share' | 'see' | 'connect';

interface SectionProps<T> {
  data: T;
  settings?: SiteSettings;
}

// --- Helper Functions ---

const getIcon = (platform: SocialPlatform, className: string = "w-5 h-5") => {
  switch (platform) {
    case 'twitter': return <Twitter className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'linkedin': return <LinkedIn className={className} />;
    case 'envelope': return <Envelope className={className} />;
    case 'medium': return <Medium className={className} />;
    case 'substack': return <Substack className={className} />;
    default: return <ArrowRight className={className} />;
  }
};

const renderBioText = (text: string, accentColor?: string) => {
  if (text.includes("Toro")) {
    const parts = text.split("Toro");
    return (
      <span>
        {parts[0]}
        <a 
          href="https://torotayo.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline hover:opacity-80 transition-opacity decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4"
          style={{ color: accentColor }}
        >
          Toro
        </a>
        {parts[1]}
      </span>
    );
  }
  return text;
};

// --- Components ---

const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <div className="h-4 mb-4" />;

  const timeString = time.toLocaleTimeString('en-US', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 animate-fadeIn">
      <span>Lagos, NG &mdash; {timeString}</span>
    </div>
  );
};

const Typewriter = ({ 
  text, 
  delay = 0, 
  speed = 40,
  className = "" 
}: { 
  text: string; 
  delay?: number; 
  speed?: number;
  className?: string 
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, started, speed]);

  return <span className={className}>{currentText}</span>;
};


// --- Section Components (Personal Site) ---

const IntroText: React.FC<SectionProps<SiteContent['intro']>> = ({ data }) => (
  <div className="max-w-3xl">
    <h1 className="text-3xl font-bold mb-6 min-h-[40px] sm:min-h-[48px]">
      <Typewriter text="Welcome to my internet home." delay={200} />
    </h1>
    <div className="space-y-6 text-xl opacity-80 font-light leading-relaxed">
       <p className="fade-in" style={{ opacity: 0, animationDelay: '1.4s', animationFillMode: 'forwards' }}>
         {data.description}
       </p>
    </div>
  </div>
);

const Who: React.FC<SectionProps<SiteContent['who']>> = ({ data, settings }) => (
  <div className="space-y-6 text-lg leading-relaxed max-w-3xl opacity-90">
    {data.bio.map((item, idx) => (
      <div key={idx} className={idx === 0 ? "text-xl font-light opacity-100" : "opacity-80"}>
        {renderBioText(item.text, settings?.accentColor)}
      </div>
    ))}
    
    <div className="my-10 pt-6 border-t border-black/10 dark:border-white/10">
      <h3 className="text-sm font-bold tracking-widest uppercase mb-6 opacity-100">
        {data.shapesMe.title}
      </h3>
      {data.shapesMe.content.map((item, idx) => (
         <p key={idx} className="mb-4 opacity-80">
             {item.text}
         </p>
      ))}
      
      <blockquote 
        className="border-l-4 pl-6 py-4 mt-8 italic bg-black/5 dark:bg-white/5 rounded-r-lg"
        style={{ borderColor: settings?.accentColor }}
      >
        <p className="opacity-90">{data.shapesMe.quote}</p>
        <footer className="text-sm font-semibold mt-2 opacity-60">
           {data.shapesMe.quoteRef}
        </footer>
      </blockquote>
    </div>
  </div>
);

const Build: React.FC<SectionProps<SiteContent['build']> & { onNavigate: (path: string) => void }> = ({ data, settings, onNavigate }) => (
  <div className="space-y-12 text-lg max-w-3xl">
    <div className="text-xl font-light mb-8 opacity-100">
       {data.description}
    </div>
    
    <div className="grid gap-6">
      {data.projects.map((proj) => {
         const isStudio = proj.title === 'Tomi Abe Studio';
         return (
         <a 
           key={proj.id} 
           href={proj.linkUrl} 
           target={isStudio ? undefined : "_blank"} 
           rel={isStudio ? undefined : "noopener noreferrer"}
           onClick={isStudio ? (e) => { e.preventDefault(); onNavigate('/studio'); } : undefined}
           className="group relative block bg-black/5 dark:bg-white/5 p-6 sm:p-8 rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all hover:shadow-sm cursor-pointer"
         >
            <div className="flex justify-between items-start mb-4">
              <h3 
                className="text-2xl font-bold mb-3 transition-colors"
                style={{ '--hover-color': settings?.accentColor } as React.CSSProperties}
              >
                <span className="group-hover:text-[var(--hover-color)] transition-colors">
                  {proj.title}
                </span>
              </h3>
              {isStudio ? (
                 <ArrowRight className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
              ) : (
                 <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="opacity-80 leading-relaxed mb-4">
               {proj.description}
            </div>
            <div className="text-sm font-medium" style={{ color: settings?.accentColor }}>
               {proj.linkText}
            </div>
         </a>
      )})}
    </div>
    
    <p className="italic opacity-50 text-sm pt-4">
      {data.footer}
    </p>
  </div>
);

const Learning: React.FC<SectionProps<SiteContent['learning']>> = ({ data, settings }) => (
  <div className="space-y-8 max-w-3xl">
    <p className="text-xl font-light mb-8 opacity-100">
      {data.description}
    </p>

    <div className="grid gap-6">
      {data.publications.map((pub) => (
         <a 
           key={pub.id} 
           href={pub.linkUrl} 
           target="_blank" 
           rel="noopener noreferrer"
           className="group relative block bg-black/5 dark:bg-white/5 p-6 sm:p-8 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20"
         >
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 
                  className="text-xl font-bold mb-1 transition-colors"
                  style={{ '--hover-color': settings?.accentColor } as React.CSSProperties}
               >
                  <span className="group-hover:text-[var(--hover-color)] transition-colors">
                    {pub.title}
                  </span>
               </h3>
               <p className="opacity-50 text-xs font-bold uppercase tracking-wider">
                  {pub.category}
               </p>
             </div>
             <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
           </div>
           <div className="opacity-80 mb-4 text-base">
               {pub.description}
           </div>
           <div className="text-sm font-medium" style={{ color: settings?.accentColor }}>
               {pub.linkText}
           </div>
         </a>
      ))}
    </div>

    <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
      <h3 className="text-lg font-bold mb-2 opacity-100">
         {data.notesTitle}
      </h3>
      <p className="opacity-70 mb-6">
         {data.notesDescription}
      </p>
      <div className="flex flex-wrap gap-3">
        {data.notesLinks.map((link, idx) => (
           <a 
             key={idx} 
             href={link.url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors flex items-center"
           >
              {link.label}
           </a>
        ))}
      </div>
    </div>
  </div>
);

const Share: React.FC<SectionProps<SiteContent['share']>> = ({ data, settings }) => (
  <div className="space-y-12 max-w-3xl">
    <p className="text-xl font-light opacity-100">
       {data.description}
    </p>

    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Highlights</h3>
        <ul className="space-y-4">
          {data.highlights.map((item, i) => (
            <li key={i} className="flex items-start opacity-90 group relative text-sm sm:text-base">
              <span className="mr-3 mt-1.5 text-[10px]" style={{ color: settings?.accentColor }}>■</span>
              <span className="leading-relaxed w-full">
                  {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">
           {data.mentorshipTitle}
        </h3>
        <div className="bg-black/5 dark:bg-white/5 p-6 rounded-xl border border-black/5 dark:border-white/5">
          <p className="opacity-90 leading-relaxed text-sm sm:text-base">
             {data.mentorshipContent}
          </p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Topics I Explore</h3>
      <div className="grid sm:grid-cols-2 gap-4">
         {data.topics.map((t, i) => (
            <div key={i} className="flex items-center opacity-90 relative group">
               <ChevronRight className="w-4 h-4 mr-2 opacity-40 flex-shrink-0"/>
               <span className="w-full text-sm font-medium">{t.text}</span>
            </div>
         ))}
      </div>
    </div>

    <div className="bg-black/5 dark:bg-white/5 p-8 rounded-xl text-center border border-black/5 dark:border-white/5">
        <p className="text-lg mb-2 font-medium opacity-100">
           {data.collabTitle}
        </p>
        <p className="opacity-70 mb-6 text-sm">
           {data.collabDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {data.buttons.map((btn, idx) => {
             const isPrimary = btn.primary;
             return (
               <a 
                 key={idx} 
                 href={btn.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style={isPrimary ? { backgroundColor: settings?.accentColor || '#18181b', color: '#fff' } : undefined}
                 className={`${!isPrimary ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700' : ''} font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all text-sm`}
               >
                  {btn.label}
               </a>
             );
          })}
        </div>
    </div>
  </div>
);

const See: React.FC<SectionProps<SiteContent['see']>> = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    setSelectedIndex(prev => prev !== null ? (prev - 1 + data.images.length) % data.images.length : null);
  };

  const handleNext = (e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    setSelectedIndex(prev => prev !== null ? (prev + 1) % data.images.length : null);
  };

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, data.images.length]);
  
  return (
    <div className="space-y-8 max-w-4xl">
      <p className="text-xl font-light max-w-md opacity-90">
        {data.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.images.map((img, index) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedIndex(index)}
            className="aspect-square bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden relative group cursor-pointer"
          >
            <img src={img.thumb} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 pt-4">
        {data.links.map((link, idx) => (
           <a 
             key={idx} 
             href={link.url} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="flex items-center opacity-60 hover:opacity-100 transition-opacity text-sm font-medium"
           >
              <span className="border-b border-black/20 dark:border-white/20 pb-0.5">
                 {link.label}
              </span>
              <ArrowTopRightOnSquare className="w-4 h-4 ml-2" />
           </a>
        ))}
      </div>

      {selectedIndex !== null && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-all backdrop-blur-sm z-50"
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
          >
            <XMark className="w-6 h-6" />
          </button>
          
          <button 
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-all backdrop-blur-sm z-50"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-all backdrop-blur-sm z-50"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <img 
            src={data.images[selectedIndex].full} 
            alt="Expanded view" 
            className="max-w-full max-h-[90vh] rounded shadow-2xl object-contain animate-fadeIn select-none"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>,
        document.body
      )}
    </div>
  );
};

const Connect: React.FC<SectionProps<SiteContent['connect']>> = ({ data }) => (
  <div className="py-4 max-w-3xl">
    <h2 className="text-3xl font-bold mb-6 opacity-100">
       {data.title}
    </h2>
    <p className="text-xl mb-10 max-w-xl opacity-70">
       {data.description}
    </p>
    
    {data.bookingLink && (
      <a 
         href={data.bookingLink}
         target="_blank"
         rel="noopener noreferrer"
         className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg mb-12 whitespace-nowrap"
      >
         Book a Conversation
      </a>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.links.map((link) => (
        <a 
          key={link.id} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="relative group bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 p-4 rounded-xl flex items-center justify-between transition-all border border-transparent hover:border-black/10 dark:hover:border-white/10"
        >
          <div className="flex flex-col w-full mr-2">
            <div className="flex items-center gap-2">
               {getIcon(link.platform, "w-4 h-4 opacity-50")}
               <span className="font-semibold text-sm">
                  {link.label || link.platform}
               </span>
            </div>
            <span className="text-xs opacity-50 mt-1">
               {link.sublabel || ''}
            </span>
          </div>
          <ArrowTopRightOnSquare className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  </div>
);

// --- Layout & Main App ---

const App: React.FC = () => {
  // Directly initialize state from imported data
  const [content] = useState<SiteContent>(personalData as unknown as SiteContent);
  const [studioContent] = useState<StudioContent>(studioDataStatic);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('site_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    }
    const hour = new Date().getHours();
    return (hour >= 19 || hour < 7) ? 'dark' : 'light';
  });

  // User preferences for shades
  const [userDarkTheme, setUserDarkTheme] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('user_dark_theme') : null;
  });
  
  const [userLightTheme, setUserLightTheme] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('user_light_theme') : null;
  });

  // User preference for font
  const [userFont, setUserFont] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('user_font') : null;
  });

  const [activeSection, setActiveSection] = useState<SectionId>('intro');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- Update Title ---
  useEffect(() => {
     if (content?.settings?.siteTitle) {
         document.title = currentPath === '/studio' 
            ? "Tomi Abe Studio" 
            : content.settings.siteTitle;
     }
  }, [content, currentPath]);

  // --- Theme Logic ---
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('site_theme', newTheme);
  };
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // --- Handle User Color Preference Selection ---
  const handleColorSelection = (mode: 'dark' | 'light', shade: string) => {
    if (mode === 'dark') {
      setUserDarkTheme(shade);
      localStorage.setItem('user_dark_theme', shade);
    } else {
      setUserLightTheme(shade);
      localStorage.setItem('user_light_theme', shade);
    }
  };

  // --- Handle User Font Selection ---
  const handleFontSelection = (font: string) => {
    setUserFont(font);
    localStorage.setItem('user_font', font);
  };

  // --- Scroll Spy & Scroll Top Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' } 
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
        setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id as SectionId);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeDarkShade = userDarkTheme || content?.settings?.darkModeTheme || 'black';
  const activeLightShade = userLightTheme || content?.settings?.lightModeTheme || 'white';

  const getThemeClasses = () => {
    if (theme === 'dark') {
      switch (activeDarkShade) {
        case 'grey': return 'bg-[#18181b] text-zinc-200';
        case 'navy': return 'bg-[#0f172a] text-slate-200';
        case 'maroon': return 'bg-[#2a0a0a] text-rose-100';
        case 'black': 
        default: return 'bg-black text-zinc-100';
      }
    } else {
      switch (activeLightShade) {
        case 'ash': return 'bg-zinc-100 text-zinc-900';
        case 'ivory': return 'bg-[#fffbeb] text-stone-900'; 
        case 'sky': return 'bg-sky-50 text-sky-950';
        case 'white':
        default: return 'bg-white text-zinc-900';
      }
    }
  };

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'who', label: 'Who Am I' },
    { id: 'build', label: 'What Do I Build' },
    { id: 'learning', label: 'What Am I Learning' },
    { id: 'share', label: 'Where Do I Share' },
    { id: 'see', label: 'What Do I See' },
    { id: 'connect', label: 'Connect' },
  ];

  const accentColor = content.settings?.accentColor || '#3b82f6';
  // Use user font first, then cms setting, then default 'sans' (Inter)
  const fontFamily = userFont || content.settings?.fontFamily || 'sans';
  const maxWidthClass = content.settings?.maxWidth || 'max-w-7xl';
  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen font-${fontFamily} transition-colors duration-500 relative ${themeClasses}`}>
      <style>{`
        ::selection {
          background-color: ${accentColor};
          color: #ffffff;
        }
      `}</style>
      
      {/* Interactive Background */}
      <InteractiveBackground isDark={theme === 'dark'} />

      {/* --- SETTINGS MODAL --- */}
      <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Appearance">
         <div className="space-y-8">
            {/* Dark Mode Toggle inside modal for convenience */}
            <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/5">
               <span className="font-medium opacity-90">Current Mode</span>
               <button 
                 onClick={toggleTheme}
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
               >
                  {theme === 'dark' ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
                  <span className="text-sm font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</span>
               </button>
            </div>

            {/* Typography Options */}
            <div>
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Typography</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'sans', label: 'Inter (System)', fontClass: 'font-sans' },
                    { id: 'manrope', label: 'Manrope', fontClass: 'font-manrope' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleFontSelection(opt.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${fontFamily === opt.id ? `border-[${accentColor}] bg-black/5 dark:bg-white/5` : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                      style={fontFamily === opt.id ? { borderColor: accentColor } : {}}
                    >
                       <span className={`text-base ${opt.fontClass}`}>{opt.label}</span>
                       {fontFamily === opt.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
               </div>
            </div>

            {/* Light Theme Options */}
            <div>
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Light Theme Palette</h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'white', label: 'Pure White', bg: 'bg-white', border: 'border-zinc-200' },
                    { id: 'ash', label: 'Soft Ash', bg: 'bg-zinc-100', border: 'border-zinc-300' },
                    { id: 'ivory', label: 'Warm Ivory', bg: 'bg-[#fffbeb]', border: 'border-amber-100' },
                    { id: 'sky', label: 'Cool Sky', bg: 'bg-sky-50', border: 'border-sky-100' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleColorSelection('light', opt.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${activeLightShade === opt.id ? `border-[${accentColor}] bg-black/5 dark:bg-white/5` : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                      style={activeLightShade === opt.id ? { borderColor: accentColor } : {}}
                    >
                       <div className={`w-12 h-12 rounded-full shadow-sm ${opt.bg} ${opt.border} border flex items-center justify-center`}>
                          {activeLightShade === opt.id && <Check className="w-6 h-6 text-zinc-900" />}
                       </div>
                       <span className="text-xs font-medium opacity-80">{opt.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Dark Theme Options */}
            <div>
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Dark Theme Palette</h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'black', label: 'True Black', bg: 'bg-black', border: 'border-zinc-800' },
                    { id: 'grey', label: 'Charcoal', bg: 'bg-[#18181b]', border: 'border-zinc-700' },
                    { id: 'navy', label: 'Deep Navy', bg: 'bg-[#0f172a]', border: 'border-slate-800' },
                    { id: 'maroon', label: 'Maroon', bg: 'bg-[#2a0a0a]', border: 'border-rose-900' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleColorSelection('dark', opt.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${activeDarkShade === opt.id ? `border-[${accentColor}] bg-black/5 dark:bg-white/5` : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                      style={activeDarkShade === opt.id ? { borderColor: accentColor } : {}}
                    >
                       <div className={`w-12 h-12 rounded-full shadow-sm ${opt.bg} ${opt.border} border flex items-center justify-center`}>
                          {activeDarkShade === opt.id && <Check className="w-6 h-6 text-white" />}
                       </div>
                       <span className="text-xs font-medium opacity-80">{opt.label}</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </Modal>

      {/* Scroll to Top Button (Mobile/Tablet Only) */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-full shadow-lg z-50 transition-all duration-300 lg:hidden flex items-center justify-center ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 opacity-90" />
      </button>

      {/* Global Navigation (Only on Studio Page) */}
      {currentPath === '/studio' && (
        <Navigation 
           currentPath={currentPath}
           onNavigate={(path) => { setCurrentPath(path); scrollToTop(); }}
           toggleTheme={toggleTheme}
           openSettings={() => setSettingsOpen(true)}
           isDark={theme === 'dark'}
        />
      )}

      {/* --- CONTENT RENDER --- */}
      {currentPath === '/studio' && studioContent ? (
         // STUDIO LAYOUT
         <StudioPage content={studioContent} settings={content.settings} />
      ) : (
         // PERSONAL LAYOUT
         <div className={`${maxWidthClass} mx-auto px-6 lg:px-8 transition-all duration-300 pt-6 lg:pt-0`}>
           <div className="lg:flex lg:gap-12">
             
             {/* --- SIDEBAR (Fixed on Desktop) --- */}
             <aside className="lg:w-1/3 xl:w-1/4 lg:h-screen lg:sticky lg:top-0 py-6 lg:py-28 flex flex-col justify-between">
               
               {/* Identity */}
               <div>
                 <div className="flex items-center justify-between mb-8 lg:mb-12">
                   <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden border-2 border-black/10 dark:border-white/10 shadow-sm transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10 group cursor-pointer">
                      <div className="absolute inset-0 bg-white/20 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none mix-blend-overlay"></div>
                      <img src={content.intro.avatar} alt="Profile" className="w-full h-full object-cover" />
                   </div>
                   
                   {/* Mobile Header Buttons */}
                   <div className="flex gap-2 lg:hidden">
                      <button 
                       onClick={() => setSettingsOpen(true)}
                       className="p-2 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                     >
                       <Swatch className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={toggleTheme} 
                       className="p-2 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                     >
                       {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                     </button>
                   </div>
                 </div>

                 <h1 className="text-3xl font-bold tracking-tight mb-2 opacity-100">
                   Tomi Abe
                 </h1>
                 <p className="text-sm font-medium tracking-widest opacity-60 uppercase mb-4">
                   {content.intro.subtitle}
                 </p>

                 {/* Mobile View: Socials & Clock */}
                 <div className="lg:hidden mb-2 space-y-4">
                   <div className="flex gap-4">
                     {content.intro.socials.map((link) => ( 
                        <a 
                           key={link.id} 
                           href={link.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="opacity-50 hover:opacity-100 transition-colors"
                        >
                           {getIcon(link.platform)}
                        </a>
                     ))}
                   </div>
                   <Clock />
                 </div>

                 {/* Navigation Links */}
                 <nav className="hidden lg:block space-y-1 mt-8">
                   {navItems.map((item) => {
                     const isActive = activeSection === item.id;
                     return (
                       <button
                         key={item.id}
                         onClick={() => scrollToSection(item.id)}
                         className={`group flex items-center w-full py-2 text-sm font-medium transition-colors ${
                           isActive
                             ? 'opacity-100' 
                             : 'opacity-50 hover:opacity-80'
                         }`}
                       >
                         <span 
                           className="w-8 h-px mr-3 transition-all duration-300"
                           style={{
                              backgroundColor: isActive ? accentColor : 'currentColor',
                              width: isActive ? '3rem' : '2rem',
                              opacity: isActive ? 1 : 0.3
                           }}
                         ></span>
                         {item.label}
                       </button>
                     );
                   })}
                 </nav>
               </div>

               {/* Footer / Socials in Sidebar */}
               <div className="hidden lg:block">
                  <div className="mb-6">
                    <Clock />
                  </div>
                  <div className="flex gap-3 mb-6 flex-wrap">
                   {content.intro.socials.map((link) => ( 
                      <a 
                         key={link.id} 
                         href={link.url} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="opacity-50 hover:opacity-100 transition-colors p-1"
                      >
                         {getIcon(link.platform)}
                      </a>
                   ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <button 
                          onClick={toggleTheme} 
                          className="p-1.5 rounded-full opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                       >
                           {theme === 'dark' ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
                       </button>
                       <button 
                          onClick={() => setSettingsOpen(true)}
                          className="p-1.5 rounded-full opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                          title="Customize Appearance"
                       >
                          <Swatch className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                  <div className="text-xs opacity-50 mt-6 font-medium">
                    &copy; 2026 Tomi Abe.
                  </div>
               </div>
             </aside>

             {/* --- MAIN CONTENT (Scrollable) --- */}
             <main className="lg:w-2/3 xl:w-3/4 py-6 lg:py-28 space-y-24 lg:space-y-32">
               
               {/* Intro Section (Not in Nav, but top of content) */}
               <section id="intro">
                  <IntroText data={content.intro} settings={content.settings} />
               </section>

               <section id="who" className="scroll-mt-24">
                  <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">Who Am I</div>
                  <Who data={content.who} settings={content.settings} />
               </section>

               <section id="build" className="scroll-mt-24">
                  <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">What Do I Build</div>
                  <Build 
                     data={content.build} 
                     settings={content.settings} 
                     onNavigate={(path) => { setCurrentPath(path); scrollToTop(); }}
                  />
               </section>

               <section id="learning" className="scroll-mt-24">
                  <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">What Am I Learning</div>
                  <Learning data={content.learning} settings={content.settings} />
               </section>

               <section id="share" className="scroll-mt-24">
                  <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">Where Do I Share</div>
                  <Share data={content.share} settings={content.settings} />
               </section>

               <section id="see" className="scroll-mt-24">
                  <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">What Do I See</div>
                  <See data={content.see} settings={content.settings} />
               </section>

               <section id="connect" className="scroll-mt-24 pb-0 lg:pb-12">
                  <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">Connect</div>
                  <Connect data={content.connect} settings={content.settings} />
               </section>

               {/* Mobile Footer */}
               <footer className="lg:hidden pt-8 !mt-8 border-t border-black/10 dark:border-white/10 text-center opacity-50 text-sm">
                  &copy; 2026 Tomi Abe.
               </footer>
             </main>

           </div>
         </div>
      )}
    </div>
  );
};

export default App;