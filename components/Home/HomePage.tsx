import React, { useState, useEffect } from 'react';
import {
    Sun,
    Moon,
    Twitter,
    Instagram,
    LinkedIn,
    Envelope,
    Medium,
    Substack,
    ArrowRight,
    Swatch
} from '../../components/Icons';
import { IntroText, Updates, Who, Build, Learning, Share, See, Connect } from './components/HomeSections';
import { SiteContent, SocialPlatform } from '../../types';
import { Editable } from '../Editor/Editable';
import { EditableImage } from '../Editor/EditableImage';

type SectionId = 'intro' | 'updates' | 'who' | 'build' | 'learning' | 'share' | 'see' | 'connect';

interface HomePageProps {
    content: SiteContent;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    openSettings: () => void;
}

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

const Clock = () => {
    const [time, setTime] = useState<Date | null>(null);
    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
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


const HomePage: React.FC<HomePageProps> = ({ content, theme, toggleTheme, openSettings }) => {
    const [activeSection, setActiveSection] = useState<SectionId>('intro');
    const accentColor = content.settings?.accentColor || '#3b82f6';

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id as SectionId);
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id as SectionId);
            });
        }, { rootMargin: '-20% 0px -60% 0px' });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-300 pt-6 lg:pt-0">
            <div className="lg:flex lg:gap-12">
                <aside className="lg:w-1/3 xl:w-1/4 lg:h-screen lg:sticky lg:top-0 py-6 lg:py-12 px-2 flex flex-col justify-between overflow-y-auto no-scrollbar gap-12">
                    <div>
                        <div className="flex items-center justify-between mb-6 lg:mb-8">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-black/10 dark:border-white/10 transition-transform duration-500 hover:scale-105 group/avatar">
                                <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="block w-full h-full">
                                    <EditableImage src={content.intro.avatar} path="intro.avatar" className="w-full h-full object-cover" />
                                </a>
                            </div>
                            <div className="flex gap-2 lg:hidden">
                                <button onClick={openSettings} className="p-2 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                                    <Swatch className="w-5 h-5" />
                                </button>
                                <button onClick={toggleTheme} className="p-2 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 opacity-100">
                            <Editable text={content.intro.name} path="intro.name" />
                        </h1>
                        <p className="text-sm font-medium tracking-widest opacity-60 uppercase mb-4">
                            <Editable text={content.intro.subtitle} path="intro.subtitle" />
                        </p>
                        <div className="lg:hidden mb-2 space-y-4">
                            <div className="flex gap-4">
                                {content.intro.socials.map((link) => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="opacity-50 opacity-100 transition-colors">
                                        {getIcon(link.platform)}
                                    </a>
                                ))}
                            </div>
                            <Clock />
                        </div>
                        <nav className="hidden lg:block space-y-1 mt-8">
                            {[{ id: 'who', label: 'Who Am I' }, { id: 'build', label: 'What Do I Build' }, { id: 'learning', label: 'What Am I Learning' }, { id: 'share', label: 'Where Do I Share' }, { id: 'see', label: 'What Do I See' }, { id: 'connect', label: 'Connect' }].map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button key={item.id} onClick={() => scrollToSection(item.id)} className={`group flex items-center w-full py-2 text-sm font-medium transition-colors ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                                        <span className="w-8 h-px mr-3 transition-all duration-300" style={{ backgroundColor: isActive ? accentColor : 'currentColor', width: isActive ? '3rem' : '2rem', opacity: isActive ? 1 : 0.3 }}></span>
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="hidden lg:block">
                        <div className="mb-6"><Clock /></div>
                        <div className="flex gap-3 mb-6 flex-wrap">
                            {content.intro.socials.map((link) => (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-colors p-1">
                                    {getIcon(link.platform)}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={toggleTheme} className="p-1.5 rounded-full opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                </button>
                                <button onClick={openSettings} className="p-1.5 rounded-full opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                    <Swatch className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="text-xs opacity-50 mt-6 font-medium">&copy; 2026 {content.intro.name}.</div>
                    </div>
                </aside>
                <main className="lg:w-2/3 xl:w-3/4 py-6 lg:py-12 space-y-24 lg:space-y-32">
                    <section id="intro"><IntroText data={content.intro} settings={content.settings} /></section>
                    {content.updates?.length > 0 && (
                      <section id="updates" className="scroll-mt-24">
                        <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">Updates</div>
                        <Updates data={content.updates} settings={content.settings} />
                      </section>
                    )}
                    <section id="who" className="scroll-mt-24">
                        <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">Who Am I</div>
                        <Who data={content.who} settings={content.settings} />
                    </section>
                    <section id="build" className="scroll-mt-24">
                        <div className="lg:hidden mb-6 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50">What Do I Build</div>
                        <Build data={content.build} settings={content.settings} />
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
                    <footer className="lg:hidden pt-8 !mt-8 border-t border-black/10 dark:border-white/10 text-center opacity-50 text-sm">&copy; 2026 {content.intro.name}.</footer>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
