import React from 'react';
import { Database, Share2, Search } from './StudioIcons';
import { ApproachData } from '../types';

interface ApproachProps {
    data: ApproachData;
}

const iconMap: Record<string, any> = {
    Share2: Share2,
    Database: Database,
    Search: Search
};

const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500'
};

const Approach: React.FC<ApproachProps> = ({ data }) => {
    return (
        <section id="approach" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Narrative */}
                <div className="lg:col-span-5 lg:sticky lg:top-32">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">{data.section_title}</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                        {data.main_heading}
                    </h3>
                    <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {data.intro_text}
                    </div>
                </div>

                {/* Right Column: Core Systems */}
                <div className="lg:col-span-7 space-y-6">
                    {data.cards.map((card, index) => {
                        const Icon = iconMap[card.icon] || Share2;
                        const colorClass = colorMap[card.color || 'blue'] || 'text-blue-500';

                        return (
                            <div key={index} className="bg-gray-100 dark:bg-[#1c1c1e] p-10 rounded-[2rem]">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 bg-white dark:bg-white/10 rounded-xl ${colorClass}`}>
                                        <Icon size={24} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{card.title}</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}

                    <div className="pt-4 px-2">
                        <p className="text-lg text-gray-500 dark:text-gray-400 italic">
                            {data.footer_text}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Approach;
