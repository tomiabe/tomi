import React from 'react';
import { ServicesData } from '../types';
import { Editable } from '../../Editor/Editable';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

interface ServicesProps {
    data: ServicesData;
}

const Services: React.FC<ServicesProps> = ({ data }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                    <Editable text={data.section_title} path="services.section_title" isStudio />
                </h2>
                <div className="text-xl text-gray-600 dark:text-gray-400">
                    <Editable text={data.description} path="services.description" isStudio multiline />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {data.items.map((service, index) => (
                    <div key={index} className="flex flex-col h-full relative group/service">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-1 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <ListControls
                                onRemove={() => removeItem('services.items', index, true)}
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <Editable text={service.title} path={`services.items.${index}.title`} isStudio />
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 mb-8 min-h-[3rem]">
                            <Editable text={service.description} path={`services.items.${index}.description`} isStudio multiline />
                        </div>

                        <ul className="space-y-3 mt-auto mb-6">
                            {service.list.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-800 dark:text-gray-300 relative group/item">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                    <span className="w-full">
                                        <Editable text={item} path={`services.items.${index}.list.${i}`} isStudio />
                                    </span>
                                    <ListControls
                                        onRemove={() => removeItem(`services.items.${index}.list`, i, true)}
                                        className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    />
                                </li>
                            ))}
                        </ul>

                        {isEditMode && (
                            <button
                                onClick={() => addItem(`services.items.${index}.list`, "New Service Detail", true)}
                                className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors w-fit"
                            >
                                + Add Detail
                            </button>
                        )}
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={() => addItem('services.items', {
                            title: "New Category",
                            description: "Category description...",
                            list: ["Service Item 1"]
                        }, true)}
                        className="py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-3xl">+</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Category</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default Services;
