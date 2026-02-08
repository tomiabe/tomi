import React from 'react';
import { ArrowRight } from './StudioIcons';
import { HeroData } from '../types';
import { Editable } from '../../Editor/Editable';
import { useEditor } from '../../Editor/EditorContext';

interface HeroProps {
    data: HeroData;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
    const { isEditMode } = useEditor();

    const handleNavigate = (url?: string) => {
        if (!url) return;
        if (url.startsWith('#')) {
            const id = url.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        window.open(url, '_blank');
    };

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col justify-center min-h-[85vh]">
            <div className="max-w-4xl">
                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white mb-8 leading-[1.05]"
                >
                    <Editable text={data.title} path="hero.title" isStudio />
                </h1>

                <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mb-12">
                    <Editable text={data.subtitle} path="hero.subtitle" isStudio multiline />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <a
                        href={data.cta_primary_link || '#'}
                        onClick={(e) => {
                            if (isEditMode) {
                                e.preventDefault();
                                return;
                            }
                            e.preventDefault();
                            handleNavigate(data.cta_primary_link);
                        }}
                        className="group inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <Editable text={data.cta_primary} path="hero.cta_primary" isStudio />
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </a>

                    <a
                        href={data.cta_secondary_link || '#'}
                        onClick={(e) => {
                            if (isEditMode) {
                                e.preventDefault();
                                return;
                            }
                            e.preventDefault();
                            handleNavigate(data.cta_secondary_link);
                        }}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10 cursor-pointer"
                    >
                        <Editable text={data.cta_secondary} path="hero.cta_secondary" isStudio />
                    </a>
                </div>
            </div>

            <div className="mt-20 border-t border-gray-200 dark:border-white/10 pt-10">
                <div className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-4xl">
                    <Editable text={data.footer_text} path="hero.footer_text" isStudio multiline />
                </div>
            </div>
        </section>
    );
};

export default Hero;
