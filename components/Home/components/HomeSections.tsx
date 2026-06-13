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
    Substack,
    Plus
} from '../../Icons';
import RichText from '../../RichText';
import { SiteContent, SiteSettings, SocialPlatform } from '../../../types';
import { Editable } from '../../Editor/Editable';
import { EditableImage } from '../../Editor/EditableImage';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

// Section Props and Utility Components
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

const openExternalUrl = (url?: string) => {
    if (!url || url === '#') return;
    if (typeof window === 'undefined') return;
    if (url.startsWith('mailto:')) {
        window.location.href = url;
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
};

const getAnchorTargetProps = (url: string) => {
    return /^https?:\/\//i.test(url)
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};
};

const Typewriter = ({ text, children, delay = 0, speed = 40, className = "" }: { text?: string; children?: string; delay?: number; speed?: number; className?: string }) => {
    const displayText = text || children || '';
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        setCurrentText('');
        setCurrentIndex(0);
        setStarted(false);
    }, [displayText]);
    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay, displayText]);
    useEffect(() => {
        if (!started) return;
        if (currentIndex < displayText.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + displayText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, started, displayText, speed]);
    return <span className={className}>{currentText}</span>;
};

export const IntroText: React.FC<SectionProps<SiteContent['intro']>> = ({ data, settings }) => (
    <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 min-h-[40px] sm:min-h-[48px]">
            <Editable text={data.welcomeText} path="intro.welcomeText" component={Typewriter} extraProps={{ delay: 200 }} />
        </h1>
        <div className="space-y-6 text-xl opacity-80 font-light leading-relaxed">
            <div className="fade-in" style={{ opacity: 0, animationDelay: '1.4s', animationFillMode: 'forwards' }}>
                <Editable text={data.description} path="intro.description" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
        </div>
    </div>
);

export const Updates: React.FC<{ data: SiteContent['updates']; settings?: SiteSettings }> = ({ data }) => {
  const recent = data.slice(0, 4);
  if (!data.length) return null;

  return (
    <div className="max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recent.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-base font-semibold leading-snug group-hover:opacity-100 transition-opacity">
                {item.title}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0 mt-0.5 opacity-30 group-hover:opacity-70 transition-opacity" />
            </div>
            <p className="text-sm opacity-60 leading-relaxed line-clamp-2 mb-2">{item.description}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium opacity-40">
              {item.label && (
                <>
                  <span>{item.label}</span>
                  <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                </>
              )}
              <span>{item.date}</span>
            </div>
          </a>
        ))}
      </div>
      <a
        href="/updates"
        className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity mt-4 ml-4"
      >
        View all updates
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

export const Who: React.FC<SectionProps<SiteContent['who']>> = ({ data, settings }) => {
    const { isEditMode, addItem, removeItem } = useEditor();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="space-y-6 text-lg leading-relaxed max-w-3xl opacity-90">
            {data.bio.map((item, idx) => (
                <div key={idx} className={`relative group ${idx === 0 ? "text-xl font-light opacity-100" : "opacity-80"} ${(idx >= 4 && !isExpanded && !isEditMode) ? 'hidden' : ''}`}>
                    <Editable text={item.text} path={`who.bio.${idx}.text`} component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                    <ListControls
                        onRemove={() => removeItem('who.bio', idx)}
                        className="absolute -left-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </div>
            ))}

            {isEditMode && (
                <button
                    onClick={() => addItem('who.bio', { text: "New bio paragraph..." })}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors py-2"
                >
                    <Plus className="w-4 h-4" /> Add Bio Paragraph
                </button>
            )}

            {/* Shapes Me Section */}
            {(isExpanded || isEditMode) && (
                <div className="animate-fadeIn space-y-6">
                    <div className="my-10 pt-6 border-t border-black/10 dark:border-white/10">
                        <h3 className="text-sm font-bold tracking-widest uppercase mb-6 opacity-100">
                            <Editable text={data.shapesMe.title} path="who.shapesMe.title" />
                        </h3>
                        {data.shapesMe.content.map((item, idx) => (
                            <div key={idx} className="relative group mb-4 opacity-80">
                                <Editable text={item.text} path={`who.shapesMe.content.${idx}.text`} component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                                <ListControls
                                    onRemove={() => removeItem('who.shapesMe.content', idx)}
                                    className="absolute -left-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        ))}
                        {isEditMode && (
                            <button
                                onClick={() => addItem('who.shapesMe.content', { text: "New content item..." })}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors mb-6"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Item
                            </button>
                        )}
                        <blockquote className="border-l-4 pl-6 py-4 mt-8 italic bg-black/5 dark:bg-white/[0.06] rounded-r-lg" style={{ borderColor: settings?.accentColor }}>
                            <p className="opacity-90">
                                <Editable text={data.shapesMe.quote} path="who.shapesMe.quote" multiline />
                            </p>
                            <footer className="text-sm font-semibold mt-2 opacity-60">
                                <Editable text={data.shapesMe.quoteRef} path="who.shapesMe.quoteRef" />
                            </footer>
                        </blockquote>
                        {data.shapesMe.closing && (
                            <div className="mt-8 opacity-70 text-[16px]">
                                <Editable text={data.shapesMe.closing} path="who.shapesMe.closing" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isEditMode && data.bio.length > 4 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors flex items-center w-fit mt-6 cursor-pointer"
                >
                    {isExpanded ? "Read Less" : "Read More"}
                </button>
            )}
        </div>
    );
};

export const Build: React.FC<SectionProps<SiteContent['build']>> = ({ data, settings }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <div className="space-y-12 text-lg max-w-3xl">
            <div className="text-xl font-light mb-8 opacity-100">
                <Editable text={data.description} path="build.description" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
            <div className="grid gap-6">
                {data.projects.map((proj, idx) => {
                    return (
                        <div key={proj.id} className="group relative block bg-black/5 dark:bg-white/[0.06] p-6 sm:p-8 rounded-xl border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all hover:shadow-sm cursor-pointer" onClick={(e) => { e.preventDefault(); !isEditMode && window.open(proj.linkUrl, '_blank'); }}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ '--hover-color': settings?.accentColor } as React.CSSProperties}>
                                    <span className="group-hover:text-[var(--hover-color)] transition-colors">
                                        <Editable text={proj.title} path={`build.projects.${idx}.title`} />
                                    </span>
                                </h3>
                                <div className="flex items-center gap-4">
                                    <ListControls
                                        onRemove={() => removeItem('build.projects', idx)}
                                    />
                                    <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="opacity-80 leading-relaxed mb-4">
                                <Editable text={proj.description} path={`build.projects.${idx}.description`} component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                            </div>
                            <div className="text-sm font-medium" style={{ color: settings?.accentColor }}>
                                <Editable text={proj.linkText} path={`build.projects.${idx}.linkText`} />
                            </div>
                            {/* Hidden editable URL */}
                            <div className={isEditMode ? "block mt-4 pt-4 border-t border-black/5 dark:border-white/5" : "hidden"}>
                                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Project Link URL</p>
                                <Editable text={proj.linkUrl} path={`build.projects.${idx}.linkUrl`} className="text-xs opacity-60 break-all" />
                            </div>
                        </div>
                    )
                })}

                {isEditMode && (
                    <button
                        onClick={() => addItem('build.projects', {
                            id: Date.now().toString(),
                            title: "New Project",
                            description: "Tell the story of this project...",
                            linkText: "View Project",
                            linkUrl: "https://example.com"
                        })}
                        className="w-full py-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <Plus className="w-8 h-8" />
                        <span className="font-bold uppercase tracking-widest text-xs">Add New Project</span>
                    </button>
                )}
            </div>
            <div className="opacity-50 text-[16px] !mt-8">
                <Editable text={data.footer} path="build.footer" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
        </div>
    );
};

export const Learning: React.FC<SectionProps<SiteContent['learning']>> = ({ data, settings }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="text-xl font-light mb-8 opacity-100">
                <Editable text={data.description} path="learning.description" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
            <div className="grid gap-6">
                {data.publications.map((pub, idx) => (
                    <div key={pub.id} className="group relative block bg-black/5 dark:bg-white/[0.06] p-6 sm:p-8 rounded-xl hover:bg-black/10 dark:hover:bg-white/[0.1] transition-colors border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 cursor-pointer" onClick={() => !isEditMode && window.open(pub.linkUrl, '_blank')}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold mb-1 transition-colors" style={{ '--hover-color': settings?.accentColor } as React.CSSProperties}>
                                    <span className="group-hover:text-[var(--hover-color)] transition-colors">
                                        <Editable text={pub.title} path={`learning.publications.${idx}.title`} />
                                    </span>
                                </h3>
                                <p className="opacity-50 text-xs font-bold uppercase tracking-wider">
                                    <Editable text={pub.category} path={`learning.publications.${idx}.category`} />
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <ListControls onRemove={() => removeItem('learning.publications', idx)} />
                                <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="opacity-80 mb-4 text-base">
                            <Editable text={pub.description} path={`learning.publications.${idx}.description`} component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                        </div>
                        <div className="text-sm font-medium" style={{ color: settings?.accentColor }}>
                            <Editable text={pub.linkText} path={`learning.publications.${idx}.linkText`} />
                        </div>
                        {isEditMode && (
                            <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Link URL</p>
                                <Editable text={pub.linkUrl} path={`learning.publications.${idx}.linkUrl`} className="text-xs opacity-60 break-all" />
                            </div>
                        )}
                    </div>
                ))}
                {isEditMode && (
                    <button
                        onClick={() => addItem('learning.publications', {
                            id: Date.now().toString(),
                            title: "New Publication",
                            category: "Article",
                            description: "Content description...",
                            linkText: "Read More",
                            linkUrl: "https://example.com"
                        })}
                        className="w-full py-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <Plus className="w-8 h-8" />
                        <span className="font-bold uppercase tracking-widest text-xs">Add Publication</span>
                    </button>
                )}
            </div>
            <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
                <h3 className="text-lg font-bold mb-2 opacity-100">
                    <Editable text={data.notesTitle} path="learning.notesTitle" />
                </h3>
                <div className="opacity-70 mb-6">
                    <Editable text={data.notesDescription} path="learning.notesDescription" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                </div>
                <div className="flex flex-wrap gap-3">
                    {data.notesLinks.map((link, idx) => (
                        isEditMode ? (
                            <div key={idx} className="relative group px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors flex items-center cursor-pointer gap-2">
                                <Editable text={link.label} path={`learning.notesLinks.${idx}.label`} />
                                <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                <div className="ml-2 pl-2 border-l border-black/10 dark:border-white/10">
                                    <ListControls onRemove={() => removeItem('learning.notesLinks', idx)} />
                                </div>
                            </div>
                        ) : (
                            <a
                                key={idx}
                                href={link.url || '#'}
                                {...getAnchorTargetProps(link.url)}
                                onClick={(e) => {
                                    if (!link.url || link.url === '#') e.preventDefault();
                                }}
                                className="relative group px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors flex items-center cursor-pointer gap-2"
                            >
                                <Editable text={link.label} path={`learning.notesLinks.${idx}.label`} />
                                <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </a>
                        )
                    ))}
                    {isEditMode && (
                        <button
                            onClick={() => addItem('learning.notesLinks', { label: "New Link", url: "#" })}
                            className="px-4 py-2 rounded-full border-2 border-dashed border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                        >
                            + Add Link
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Share: React.FC<SectionProps<SiteContent['share']>> = ({ data, settings }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <div className="space-y-12 max-w-3xl">
            <div className="text-xl font-light opacity-100">
                <Editable text={data.description} path="share.description" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Highlights</h3>
                    <ul className="space-y-4">
                        {data.highlights.map((item, i) => (
                            <li key={i} className="flex items-start opacity-90 group relative text-sm sm:text-base">
                                <span className="mr-3 mt-[0.65em] text-[10px] flex-shrink-0 leading-none" style={{ color: settings?.accentColor }}>■</span>
                                <div className="leading-relaxed w-full">
                                    <Editable text={item.text} path={`share.highlights.${i}.text`} component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                                </div>
                                <ListControls
                                    onRemove={() => removeItem('share.highlights', i)}
                                    className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </li>
                        ))}
                    </ul>
                    {isEditMode && (
                        <button
                            onClick={() => addItem('share.highlights', { text: "New highlight item..." })}
                            className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Highlight
                        </button>
                    )}
                </div>
                <div>
                    <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">
                        <Editable text={data.mentorshipTitle} path="share.mentorshipTitle" />
                    </h3>
                    <div className="bg-black/5 dark:bg-white/[0.06] p-6 rounded-xl border border-black/5 dark:border-white/10">
                        <div className="opacity-90 leading-relaxed text-sm –base">
                            <Editable text={data.mentorshipContent} path="share.mentorshipContent" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Topics I Explore</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    {data.topics.map((t, i) => (
                        <div key={i} className="flex items-start opacity-90 relative group">
                            <ChevronRight className="w-4 h-4 mr-2 mt-1 opacity-40 flex-shrink-0" />
                            <span className="w-full text-sm font-medium leading-relaxed">
                                <Editable text={t.text} path={`share.topics.${i}.text`} />
                            </span>
                            <ListControls
                                onRemove={() => removeItem('share.topics', i)}
                                className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                    {isEditMode && (
                        <button
                            onClick={() => addItem('share.topics', { text: "New topic..." })}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Topic
                        </button>
                    )}
                </div>
            </div>
            <div className="bg-black/5 dark:bg-white/[0.06] p-8 rounded-xl text-center border border-black/5 dark:border-white/10">
                <p className="text-lg mb-2 font-medium opacity-100">
                    <Editable text={data.collabTitle} path="share.collabTitle" />
                </p>
                <div className="opacity-70 mb-6 text-sm">
                    <Editable text={data.collabDescription} path="share.collabDescription" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {data.buttons.map((btn, idx) => (
                        <div key={idx} className="relative group">
                            {isEditMode ? (
                                <div style={btn.primary ? { backgroundColor: settings?.accentColor || '#18181b', color: '#fff' } : undefined} className={`${!btn.primary ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700' : ''} font-semibold px-6 rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center min-h-[44px] cursor-pointer`}>
                                    <Editable text={btn.label} path={`share.buttons.${idx}.label`} />
                                    <ListControls onRemove={() => removeItem('share.buttons', idx)} className="ml-2" />
                                </div>
                            ) : (
                                <a
                                    href={btn.url || '#'}
                                    {...getAnchorTargetProps(btn.url)}
                                    onClick={(e) => {
                                        if (!btn.url || btn.url === '#') e.preventDefault();
                                    }}
                                    style={btn.primary ? { backgroundColor: settings?.accentColor || '#18181b', color: '#fff' } : undefined}
                                    className={`${!btn.primary ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700' : ''} font-semibold px-6 rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center min-h-[44px] cursor-pointer`}
                                >
                                    <Editable text={btn.label} path={`share.buttons.${idx}.label`} />
                                </a>
                            )}
                        </div>
                    ))}
                    {isEditMode && (
                        <button
                            onClick={() => addItem('share.buttons', { label: "New Button", url: "#", primary: false })}
                            className="px-6 h-11 border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                        >
                            + Add Button
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const See: React.FC<SectionProps<SiteContent['see']>> = ({ data, settings }) => {
    const { isEditMode, addItem, removeItem } = useEditor();
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
            <div className="text-xl font-light w-full opacity-90">
                <Editable text={data.description} path="see.description" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.images.map((img, index) => (
                    <div key={img.id} onClick={() => !isEditMode && setSelectedIndex(index)} className="aspect-square bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden relative group cursor-pointer">
                        <EditableImage src={img.image} path={`see.images.${index}.image`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                        <ListControls
                            onRemove={() => removeItem('see.images', index)}
                            className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                ))}
                {isEditMode && (
                    <button
                        onClick={() => addItem('see.images', { id: Date.now().toString(), image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop" })}
                        className="aspect-square border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <Plus className="w-8 h-8" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Image</span>
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
                {data.links.map((link, idx) => (
                    isEditMode ? (
                        <div key={idx} className="flex items-center group opacity-60 hover:opacity-100 transition-opacity text-sm font-medium cursor-pointer">
                            <span className="border-b border-black/20 dark:border-white/20 pb-0.5">
                                <Editable text={link.label} path={`see.links.${idx}.label`} />
                            </span>
                            <ListControls onRemove={() => removeItem('see.links', idx)} className="ml-2 pr-2" />
                            <ArrowTopRightOnSquare className="w-4 h-4 ml-2" />
                        </div>
                    ) : (
                        <a
                            key={idx}
                            href={link.url || '#'}
                            {...getAnchorTargetProps(link.url)}
                            onClick={(e) => {
                                if (!link.url || link.url === '#') e.preventDefault();
                            }}
                            className="flex items-center group opacity-60 hover:opacity-100 transition-opacity text-sm font-medium cursor-pointer"
                        >
                            <span className="border-b border-black/20 dark:border-white/20 pb-0.5">
                                <Editable text={link.label} path={`see.links.${idx}.label`} />
                            </span>
                            <ArrowTopRightOnSquare className="w-4 h-4 ml-2" />
                        </a>
                    )
                ))}
                {isEditMode && (
                    <button
                        onClick={() => addItem('see.links', { label: "New Link", url: "#" })}
                        className="px-4 py-1.5 border-2 border-dashed border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                    >
                        + Add Link
                    </button>
                )}
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

export const Connect: React.FC<SectionProps<SiteContent['connect']>> = ({ data, settings }) => {
    const { isEditMode, addItem, removeItem } = useEditor();

    return (
        <div className="py-4 w-full max-w-5xl">
            <h2 className="text-3xl font-bold mb-6 opacity-100">
                <Editable text={data.title} path="connect.title" />
            </h2>
            <div className="text-xl mb-10 w-full opacity-70">
                <Editable text={data.description} path="connect.description" component={RichText} extraProps={{ accentColor: settings?.accentColor }} multiline />
            </div>
            {data.bookingLink && <div onClick={() => !isEditMode && openExternalUrl(data.bookingLink)} className="flex items-center justify-center w-full sm:w-fit px-8 h-12 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg mb-12 whitespace-nowrap mx-auto sm:mx-0 cursor-pointer">Book a Conversation</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.links.map((link, idx) => (
                    <div key={link.id} onClick={() => !isEditMode && openExternalUrl(link.url)} className="relative group bg-black/5 hover:bg-black/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] p-4 rounded-xl flex items-center justify-between transition-all border border-transparent dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 cursor-pointer">
                        <div className="flex flex-col w-full mr-2">
                            <div className="flex items-center gap-2">
                                {getIcon(link.platform, "w-4 h-4 opacity-50")}
                                <span className="font-semibold text-sm">
                                    <Editable text={link.label || link.platform} path={`connect.links.${idx}.label`} />
                                </span>
                            </div>
                            <span className="text-xs opacity-50 mt-1">
                                <Editable text={link.sublabel || ''} path={`connect.links.${idx}.sublabel`} />
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ListControls onRemove={() => removeItem('connect.links', idx)} />
                            <ArrowTopRightOnSquare className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
                {isEditMode && (
                    <button
                        onClick={() => addItem('connect.links', {
                            id: Date.now().toString(),
                            platform: "envelope",
                            label: "New Contact",
                            sublabel: "hello@example.com",
                            url: "mailto:hello@example.com"
                        })}
                        className="p-4 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Add Link</span>
                    </button>
                )}
            </div>
        </div>
    );
};
