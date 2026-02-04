import React from 'react';
import { Mail, Linkedin, Twitter, Instagram, Facebook, Github, Globe, Youtube, Dribbble, MapPin, Plus } from './StudioIcons';
import { ContactData } from '../types';
import { Editable } from '../../Editor/Editable';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

interface ContactProps {
    data: ContactData;
}

const iconMap: Record<string, React.ReactNode> = {
    Linkedin: <Linkedin size={24} />,
    Twitter: <Twitter size={24} />,
    Instagram: <Instagram size={24} />,
    Facebook: <Facebook size={24} />,
    Github: <Github size={24} />,
    Globe: <Globe size={24} />,
    Youtube: <Youtube size={24} />,
    Dribbble: <Dribbble size={24} />,
    Mail: <Mail size={24} />
};

const Contact: React.FC<ContactProps> = ({ data }) => {
    const { addItem, removeItem, isEditMode } = useEditor();
    // Safety check: ensure socials is an array before mapping
    const socialsList = Array.isArray(data.socials) ? data.socials : [];

    return (
        <footer id="contact" className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="bg-black text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 relative overflow-hidden">
                {/* Subtle background accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-16">
                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                            <Editable text={data.title} path="contact.title" isStudio />
                        </h2>
                        <div className="text-lg md:text-xl text-gray-400 max-w-md">
                            <Editable text={data.description} path="contact.description" isStudio multiline />
                        </div>

                        <a
                            href={data.booking_link || '#'}
                            target={data.booking_link ? '_blank' : undefined}
                            rel={data.booking_link ? 'noopener noreferrer' : undefined}
                            onClick={(e) => {
                                if (isEditMode || !data.booking_link) {
                                    e.preventDefault();
                                }
                            }}
                            aria-disabled={!data.booking_link}
                            className="inline-flex items-center justify-center md:justify-start gap-3 bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-gray-200 transition-colors whitespace-nowrap w-full md:w-auto cursor-pointer"
                        >
                            <Mail size={20} />
                            <span>
                                <Editable text={data.button_text} path="contact.button_text" isStudio />
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-col justify-between space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                                <Mail className="w-5 h-5 shrink-0" />
                                <div className="text-base md:text-lg break-all md:break-normal">
                                    <Editable text={data.email} path="contact.email" isStudio />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                                <MapPin className="w-5 h-5 shrink-0" />
                                <span className="text-base md:text-lg">
                                    <Editable text={data.location} path="contact.location" isStudio />
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                            {socialsList.map((social, idx) => (
                                <div key={idx} className="group/social relative">
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors block"
                                        aria-label={social.platform}
                                        title={social.platform}
                                        onClick={(e) => isEditMode && e.preventDefault()}
                                    >
                                        {iconMap[social.platform] || <Globe size={24} />}
                                    </a>
                                    <ListControls
                                        onRemove={() => removeItem('contact.socials', idx, true)}
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/social:opacity-100 transition-opacity"
                                    />
                                    {isEditMode && (
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-white/10 p-2 rounded-lg min-w-[200px] opacity-0 group-hover/social:opacity-100 transition-opacity">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Platform</p>
                                            <Editable text={social.platform} path={`contact.socials.${idx}.platform`} isStudio className="text-xs text-white mb-2" />
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">URL</p>
                                            <Editable text={social.url} path={`contact.socials.${idx}.url`} isStudio className="text-xs text-white break-all" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isEditMode && (
                                <button
                                    onClick={() => addItem('contact.socials', { platform: "Linkedin", url: "https://linkedin.com" }, true)}
                                    className="p-3 border-2 border-dashed border-white/20 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                                >
                                    <Plus className="w-5 h-5 text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-gray-500 gap-4">
                    <div>
                        <Editable text={data.footer_copyright} path="contact.footer_copyright" isStudio />
                    </div>
                    <div>
                        <Editable text={data.footer_tagline} path="contact.footer_tagline" isStudio />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Contact;
