import React from 'react';
import { Mail, Linkedin, Twitter, Instagram, Facebook, Github, Globe, Youtube, Dribbble, MapPin } from './StudioIcons';
import { ContactData } from '../types';

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
    // Safety check: ensure socials is an array before mapping
    const socialsList = Array.isArray(data.socials) ? data.socials : [];

    return (
        <footer id="contact" className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="bg-black text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 relative overflow-hidden">
                {/* Subtle background accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-16">
                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight">{data.title}</h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-md">
                            {data.description}
                        </p>

                        <a href={data.booking_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center md:justify-start gap-3 bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-gray-200 transition-colors whitespace-nowrap w-full md:w-auto">
                            <Mail size={20} />
                            <span>{data.button_text}</span>
                        </a>
                    </div>

                    <div className="flex flex-col justify-between space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                                <Mail className="w-5 h-5 shrink-0" />
                                <a href={`mailto:${data.email}`} className="text-base md:text-lg break-all md:break-normal">{data.email}</a>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                                <MapPin className="w-5 h-5 shrink-0" />
                                <span className="text-base md:text-lg">{data.location}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 md:gap-6">
                            {socialsList.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    aria-label={social.platform}
                                    title={social.platform}
                                >
                                    {iconMap[social.platform] || <Globe size={24} />}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-gray-500 gap-4">
                    <p>{data.footer_copyright}</p>
                    <p>{data.footer_tagline}</p>
                </div>
            </div>
        </footer>
    );
};

export default Contact;
