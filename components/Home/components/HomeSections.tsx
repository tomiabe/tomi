import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronRight,
    ChevronLeft,
    ArrowTopRightOnSquare,
    ArrowRight,
    ArrowUpRight,
    XMark,
    Twitter,
    Instagram,
    LinkedIn,
    Envelope,
    Medium,
    Substack
} from '../../Icons';
import RichText from '../../RichText';
import { SiteContent, SiteSettings, SocialPlatform } from '../../../types';

type SectionProps<T> = {
    data: T;
    settings?: SiteSettings;
    onNavigate?: (path: string) => void;
};

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

const Typewriter = ({ text, delay = 0, speed = 40, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        setCurrentText('');
        setCurrentIndex(0);
        setStarted(false);
    }, [text]);
    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay, text]);
    useEffect(() => {
        if (!started) return;
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, started, text, speed]);
    return <span className={className}>{currentText}</span>;
};

export const IntroText: React.FC<SectionProps<SiteContent['intro']>> = ({ data, settings }) => (
    <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 min-h-[40px] sm:min-h-[48px]">
            <Typewriter text={data.welcomeText} delay={200} />
        </h1>
        <div className="space-y-6 text-xl opacity-80 font-light leading-relaxed">
            <div className="fade-in" style={{ opacity: 0, animationDelay: '1.4s', animationFillMode: 'forwards' }}>
                <RichText content={data.description} accentColor={settings?.accentColor} />
            </div>
        </div>
    </div>
);

export const Who: React.FC<SectionProps<SiteContent['who']>> = ({ data, settings }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleBio = data.bio.slice(0, 4);
    const hiddenBio = data.bio.slice(4);

    return (
        <div className="space-y-6 text-lg leading-relaxed max-w-3xl opacity-90">
            {visibleBio.map((item, idx) => (
                <div key={idx} className={idx === 0 ? "text-xl font-light opacity-100" : "opacity-80"}>
                    <RichText content={item.text} accentColor={settings?.accentColor} />
                </div>
            ))}

            {isExpanded && (
                <div className="animate-fadeIn space-y-6">
                    {hiddenBio.map((item, idx) => (
                        <div key={idx + 3} className="opacity-80">
                            <RichText content={item.text} accentColor={settings?.accentColor} />
                        </div>
                    ))}
                    <div className="my-10 pt-6 border-t border-black/10 dark:border-white/10">
                        <h3 className="text-sm font-bold tracking-widest uppercase mb-6 opacity-100">{data.shapesMe.title}</h3>
                        {data.shapesMe.content.map((item, idx) => (
                            <div key={idx} className="mb-4 opacity-80">
                                <RichText content={item.text} accentColor={settings?.accentColor} />
                            </div>
                        ))}
                        <blockquote className="border-l-4 pl-6 py-4 mt-8 italic bg-black/5 dark:bg-white/[0.06] rounded-r-lg" style={{ borderColor: settings?.accentColor }}>
                            <p className="opacity-90">{data.shapesMe.quote}</p>
                            <footer className="text-sm font-semibold mt-2 opacity-60">{data.shapesMe.quoteRef}</footer>
                        </blockquote>
                        {data.shapesMe.closing && (
                            <div className="mt-8 opacity-70 text-[16px]">
                                <RichText content={data.shapesMe.closing} accentColor={settings?.accentColor} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors flex items-center w-fit mt-6 cursor-pointer"
            >
                {isExpanded ? "Read Less" : "Read More"}
            </button>
        </div>
    );
};

export const Build: React.FC<SectionProps<SiteContent['build']> & { onNavigate: (path: string) => void }> = ({ data, settings, onNavigate }) => (
    <div className="space-y-12 text-lg max-w-3xl">
        <div className="text-xl font-light mb-8 opacity-100">
            <RichText content={data.description} accentColor={settings?.accentColor} />
        </div>
        <div className="grid gap-6">
            {data.projects.map((proj) => {
                const isStudio = proj.title === 'Tomi Abe Studio';
                return (
                    <a key={proj.id} href={proj.linkUrl} target={isStudio ? undefined : "_blank"} rel={isStudio ? undefined : "noopener noreferrer"} onClick={isStudio ? (e) => { e.preventDefault(); onNavigate('/studio'); } : undefined} className="group relative block bg-black/5 dark:bg-white/[0.06] p-6 sm:p-8 rounded-xl border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all hover:shadow-sm cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ '--hover-color': settings?.accentColor } as React.CSSProperties}>
                                <span className="group-hover:text-[var(--hover-color)] transition-colors">{proj.title}</span>
                            </h3>
                            {isStudio ? <ArrowRight className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" /> : <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />}
                        </div>
                        <div className="opacity-80 leading-relaxed mb-4">
                            <RichText content={proj.description} accentColor={settings?.accentColor} />
                        </div>
                        <div className="text-sm font-medium" style={{ color: settings?.accentColor }}>{proj.linkText}</div>
                    </a>
                )
            })}
        </div>
        <div className="opacity-50 text-[16px] !mt-8"><RichText content={data.footer} accentColor={settings?.accentColor} /></div>
    </div>
);

export const Learning: React.FC<SectionProps<SiteContent['learning']>> = ({ data, settings }) => (
    <div className="space-y-8 max-w-3xl">
        <div className="text-xl font-light mb-8 opacity-100"><RichText content={data.description} accentColor={settings?.accentColor} /></div>
        <div className="grid gap-6">
            {data.publications.map((pub) => (
                <a key={pub.id} href={pub.linkUrl} target="_blank" rel="noopener noreferrer" className="group relative block bg-black/5 dark:bg-white/[0.06] p-6 sm:p-8 rounded-xl hover:bg-black/10 dark:hover:bg-white/[0.1] transition-colors border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1 transition-colors" style={{ '--hover-color': settings?.accentColor } as React.CSSProperties}>
                                <span className="group-hover:text-[var(--hover-color)] transition-colors">{pub.title}</span>
                            </h3>
                            <p className="opacity-50 text-xs font-bold uppercase tracking-wider">{pub.category}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="opacity-80 mb-4 text-base"><RichText content={pub.description} accentColor={settings?.accentColor} /></div>
                    <div className="text-sm font-medium" style={{ color: settings?.accentColor }}>{pub.linkText}</div>
                </a>
            ))}
        </div>
        <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
            <h3 className="text-lg font-bold mb-2 opacity-100">{data.notesTitle}</h3>
            <div className="opacity-70 mb-6"><RichText content={data.notesDescription} accentColor={settings?.accentColor} /></div>
            <div className="flex flex-wrap gap-3">
                {data.notesLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors flex items-center">{link.label}</a>
                ))}
            </div>
        </div>
    </div>
);

export const Share: React.FC<SectionProps<SiteContent['share']>> = ({ data, settings }) => (
    <div className="space-y-12 max-w-3xl">
        <div className="text-xl font-light opacity-100"><RichText content={data.description} accentColor={settings?.accentColor} /></div>
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Highlights</h3>
                <ul className="space-y-4">
                    {data.highlights.map((item, i) => (
                        <li key={i} className="flex items-start opacity-90 group relative text-sm sm:text-base">
                            <span className="mr-3 mt-[0.65em] text-[10px] flex-shrink-0 leading-none" style={{ color: settings?.accentColor }}>■</span>
                            <div className="leading-relaxed w-full"><RichText content={item.text} accentColor={settings?.accentColor} /></div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">{data.mentorshipTitle}</h3>
                <div className="bg-black/5 dark:bg-white/[0.06] p-6 rounded-xl border border-black/5 dark:border-white/10">
                    <div className="opacity-90 leading-relaxed text-sm –base"><RichText content={data.mentorshipContent} accentColor={settings?.accentColor} /></div>
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Topics I Explore</h3>
            <div className="grid sm:grid-cols-2 gap-4">
                {data.topics.map((t, i) => (
                    <div key={i} className="flex items-start opacity-90 relative group">
                        {/* Alignment fix: Chevron aligned to the top of the text line */}
                        <ChevronRight className="w-4 h-4 mr-2 mt-1 opacity-40 flex-shrink-0" />
                        <span className="w-full text-sm font-medium leading-relaxed">{t.text}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-black/5 dark:bg-white/[0.06] p-8 rounded-xl text-center border border-black/5 dark:border-white/10">
            <p className="text-lg mb-2 font-medium opacity-100">{data.collabTitle}</p>
            <div className="opacity-70 mb-6 text-sm"><RichText content={data.collabDescription} accentColor={settings?.accentColor} /></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {data.buttons.map((btn, idx) => (
                    <a key={idx} href={btn.url} target="_blank" rel="noopener noreferrer" style={btn.primary ? { backgroundColor: settings?.accentColor || '#18181b', color: '#fff' } : undefined} className={`${!btn.primary ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700' : ''} font-semibold px-6 rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center min-h-[44px]`}>{btn.label}</a>
                ))}
            </div>
        </div>
    </div>
);

export const See: React.FC<SectionProps<SiteContent['see']>> = ({ data, settings }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const handlePrev = (e: React.MouseEvent | KeyboardEvent) => { e.stopPropagation(); setSelectedIndex(prev => prev !== null ? (prev - 1 + data.images.length) % data.images.length : null); };
    const handleNext = (e: React.MouseEvent | KeyboardEvent) => { e.stopPropagation(); setSelectedIndex(prev => prev !== null ? (prev + 1) % data.images.length : null); };
    useEffect(() => {
        if (selectedIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') handlePrev(e); if (e.key === 'ArrowRight') handleNext(e); if (e.key === 'Escape') setSelectedIndex(null); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, data.images.length]);
    return (
        <div className="space-y-8 max-w-4xl">
            <div className="text-xl font-light w-full opacity-90"><RichText content={data.description} accentColor={settings?.accentColor} /></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.images.map((img, index) => (
                    <div key={img.id} onClick={() => setSelectedIndex(index)} className="aspect-square bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden relative group cursor-pointer">
                        <img src={img.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
                {data.links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center opacity-60 hover:opacity-100 transition-opacity text-sm font-medium">
                        <span className="border-b border-black/20 dark:border-white/20 pb-0.5">{link.label}</span>
                        <ArrowTopRightOnSquare className="w-4 h-4 ml-2" />
                    </a>
                ))}
            </div>
            {selectedIndex !== null && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn" onClick={() => setSelectedIndex(null)}>
                    <button className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-all backdrop-blur-sm z-50" onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}><XMark className="w-6 h-6" /></button>
                    <button className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-all backdrop-blur-sm z-50" onClick={handlePrev}><ChevronLeft className="w-6 h-6" /></button>
                    <button className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-all backdrop-blur-sm z-50" onClick={handleNext}><ChevronRight className="w-6 h-6" /></button>
                    <img src={data.images[selectedIndex].image} alt="Expanded view" className="max-w-full max-h-[90vh] rounded shadow-2xl object-contain animate-fadeIn select-none" onClick={(e) => e.stopPropagation()} />
                </div>, document.body
            )}
        </div>
    );
};

export const Connect: React.FC<SectionProps<SiteContent['connect']>> = ({ data, settings }) => (
    <div className="py-4 w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 opacity-100">{data.title}</h2>
        <div className="text-xl mb-10 w-full opacity-70"><RichText content={data.description} accentColor={settings?.accentColor} /></div>
        {data.bookingLink && <a href={data.bookingLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full sm:w-fit px-8 h-12 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg mb-12 whitespace-nowrap mx-auto sm:mx-0">Book a Conversation</a>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.links.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="relative group bg-black/5 hover:bg-black/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] p-4 rounded-xl flex items-center justify-between transition-all border border-transparent dark:border-white/10 hover:border-black/10 dark:hover:border-white/20">
                    <div className="flex flex-col w-full mr-2">
                        <div className="flex items-center gap-2">{getIcon(link.platform, "w-4 h-4 opacity-50")}<span className="font-semibold text-sm">{link.label || link.platform}</span></div>
                        <span className="text-xs opacity-50 mt-1">{link.sublabel || ''}</span>
                    </div>
                    <ArrowTopRightOnSquare className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>
            ))}
        </div>
    </div>
);
