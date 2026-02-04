import React from 'react';
import { AboutData } from '../types';
import { Editable } from '../../Editor/Editable';
import { EditableImage } from '../../Editor/EditableImage';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

interface AboutProps {
    data: AboutData;
}

const About: React.FC<AboutProps> = ({ data }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto bg-gray-50 dark:bg-[#0c0c0c] rounded-[3rem] my-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="order-2 lg:order-1 space-y-8">
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                            <Editable text={data.section_title} path="about.section_title" isStudio />
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            <Editable text={data.main_heading} path="about.main_heading" isStudio />
                        </h3>
                    </div>

                    <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {data.intro_paragraphs.map((para, idx) => (
                            <div key={idx} className="relative group/para">
                                <Editable text={para} path={`about.intro_paragraphs.${idx}`} isStudio multiline />
                                <ListControls
                                    onRemove={() => removeItem('about.intro_paragraphs', idx, true)}
                                    className="absolute -left-10 top-0 opacity-0 group-hover/para:opacity-100 transition-opacity"
                                />
                            </div>
                        ))}
                        {isEditMode && (
                            <button
                                onClick={() => addItem('about.intro_paragraphs', "New bio paragraph...", true)}
                                className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                + Add Paragraph
                            </button>
                        )}
                    </div>

                    <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                            <Editable text={data.speaking_title} path="about.speaking_title" isStudio />
                        </h4>
                        {data.speaking_intro && (
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                <Editable text={data.speaking_intro} path="about.speaking_intro" isStudio multiline />
                            </p>
                        )}
                        {data.speaking_highlights_label && (
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                                <Editable text={data.speaking_highlights_label} path="about.speaking_highlights_label" isStudio />
                            </p>
                        )}
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                            {data.speaking_items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 relative group/item">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                    <span className="w-full">
                                        <Editable text={item} path={`about.speaking_items.${idx}`} isStudio />
                                    </span>
                                    <ListControls
                                        onRemove={() => removeItem('about.speaking_items', idx, true)}
                                        className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    />
                                </li>
                            ))}
                        </ul>
                        {isEditMode && (
                            <button
                                onClick={() => addItem('about.speaking_items', "New speaking engagement or topic", true)}
                                className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                + Add Speaking Item
                            </button>
                        )}
                    </div>
                </div>

                {/* Image - Placed to visually align with "Talking about me" */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                        <EditableImage
                            src={data.image_url}
                            path="about.image_url"
                            isStudio
                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                            <h4 className="text-white font-medium text-lg">
                                <Editable text={data.name} path="about.name" isStudio />
                            </h4>
                            <p className="text-white/60 text-sm">
                                <Editable text={data.role} path="about.role" isStudio />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
