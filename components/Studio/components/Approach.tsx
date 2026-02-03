import React from 'react';
import { Database, Share2, Search } from './StudioIcons';
import { ApproachData } from '../types';
import { Editable } from '../../Editor/Editable';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

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
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <section id="approach" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Narrative */}
                <div className="lg:col-span-5 lg:sticky lg:top-32">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
                        <Editable text={data.section_title} path="approach.section_title" isStudio />
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                        <Editable text={data.main_heading} path="approach.main_heading" isStudio />
                    </h3>
                    <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        <Editable text={data.intro_text} path="approach.intro_text" isStudio multiline />
                    </div>
                </div>

                {/* Right Column: Core Systems */}
                <div className="lg:col-span-7 space-y-6">
                    {data.cards.map((card, index) => {
                        const Icon = iconMap[card.icon] || Share2;
                        const colorClass = colorMap[card.color || 'blue'] || 'text-blue-500';

                        return (
                            <div key={index} className="bg-gray-100 dark:bg-[#1c1c1e] p-10 rounded-[2rem] relative group/card">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 bg-white dark:bg-white/10 rounded-xl ${colorClass}`}>
                                            <Icon size={24} />
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            <Editable text={card.title} path={`approach.cards.${index}.title`} isStudio />
                                        </h4>
                                    </div>
                                    <ListControls
                                        onRemove={() => removeItem('approach.cards', index, true)}
                                    />
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 text-lg">
                                    <Editable text={card.description} path={`approach.cards.${index}.description`} isStudio multiline />
                                </div>
                            </div>
                        );
                    })}

                    {isEditMode && (
                        <button
                            onClick={() => addItem('approach.cards', {
                                title: "New Approach",
                                description: "How we work...",
                                icon: "Share2",
                                color: "blue"
                            }, true)}
                            className="w-full py-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <span className="text-3xl">+</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Add Approach Card</span>
                        </button>
                    )}

                    <div className="pt-4 px-2">
                        <div className="text-lg text-gray-500 dark:text-gray-400 italic">
                            <Editable text={data.footer_text} path="approach.footer_text" isStudio />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Approach;
