import React from 'react';
import { SelectedWorkData } from '../types';
import { ArrowRight } from './StudioIcons';
import { Editable } from '../../Editor/Editable';
import { EditableImage } from '../../Editor/EditableImage';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

interface SelectedWorkProps {
    data: SelectedWorkData;
}

const SelectedWork: React.FC<SelectedWorkProps> = ({ data }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <section id="work" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-20 max-w-3xl">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                    <Editable text={data.section_title} path="selectedWork.section_title" isStudio />
                </h2>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    <Editable text={data.main_heading} path="selectedWork.main_heading" isStudio />
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {data.tags.map((tag, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full flex items-center gap-2 group/tag relative">
                            <Editable text={tag} path={`selectedWork.tags.${index}`} isStudio />
                            <ListControls
                                onRemove={() => removeItem('selectedWork.tags', index, true)}
                                className="opacity-0 group-hover/tag:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                    {isEditMode && (
                        <button
                            onClick={() => addItem('selectedWork.tags', "New Tag", true)}
                            className="px-4 py-2 rounded-full border-2 border-dashed border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                        >
                            + Tag
                        </button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
                {data.projects.map((project, index) => (
                    <div key={index} className="group relative">
                        <div className="absolute -top-4 -right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ListControls
                                onRemove={() => removeItem('selectedWork.projects', index, true)}
                            />
                        </div>
                        <div className="relative overflow-hidden rounded-3xl mb-8 aspect-[4/3]">
                            <div className="absolute top-4 left-4 z-10 w-16 h-16 bg-white dark:bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center p-3 shadow-lg border border-gray-100 dark:border-white/10">
                                <EditableImage
                                    src={project.logoUrl}
                                    path={`selectedWork.projects.${index}.logoUrl`}
                                    isStudio
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <EditableImage
                                src={project.imageUrl}
                                path={`selectedWork.projects.${index}.imageUrl`}
                                isStudio
                                className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-0">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    <Editable text={project.title} path={`selectedWork.projects.${index}.title`} isStudio />
                                </h3>
                                <div className="text-xs uppercase tracking-wider text-gray-500">
                                    <Editable text={project.category} path={`selectedWork.projects.${index}.category`} isStudio />
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                <Editable text={project.location} path={`selectedWork.projects.${index}.location`} isStudio />
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed py-2">
                                <Editable text={project.description} path={`selectedWork.projects.${index}.description`} isStudio multiline />
                            </div>

                            <div className="flex flex-col gap-2">
                                <a
                                    href={project.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline pt-2"
                                    onClick={(e) => isEditMode && e.preventDefault()}
                                >
                                    <Editable text={project.linkText} path={`selectedWork.projects.${index}.linkText`} isStudio /> <ArrowRight size={16} />
                                </a>
                                {isEditMode && (
                                    <div className="pt-2 border-t border-black/5 dark:border-white/5">
                                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Project Link URL</p>
                                        <Editable text={project.linkUrl} path={`selectedWork.projects.${index}.linkUrl`} className="text-xs opacity-60 break-all" isStudio />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={() => addItem('selectedWork.projects', {
                            title: "New Project",
                            description: "Project description...",
                            imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
                            logoUrl: "https://tomiabe.com/wp-content/uploads/2023/11/Asset-1@2x.png",
                            category: "Category",
                            location: "Remote / Global",
                            linkText: "View Case Study",
                            linkUrl: "https://example.com"
                        }, true)}
                        className="py-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-4xl">+</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Project Card</span>
                    </button>
                )}
            </div>

            <div className="mt-20 text-center">
                <div className="inline-block px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                    <Editable text={data.footer_text} path="selectedWork.footer_text" isStudio />
                </div>
            </div>
        </section>
    );
};

export default SelectedWork;
