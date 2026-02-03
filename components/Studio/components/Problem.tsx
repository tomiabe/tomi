import React from 'react';
import { Layers, Box, Maximize2, Minimize2 } from './StudioIcons';
import { ProblemData } from '../types';
import { Editable } from '../../Editor/Editable';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

interface ProblemProps {
    data: ProblemData;
}

const iconMap: Record<string, React.ReactNode> = {
    Layers: <Layers className="w-8 h-8 text-blue-500" />,
    Box: <Box className="w-8 h-8 text-purple-500" />,
    Maximize2: <Maximize2 className="w-8 h-8 text-orange-500" />,
    Minimize2: <Minimize2 className="w-8 h-8 text-green-500" />
};

const Problem: React.FC<ProblemProps> = ({ data }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-50 dark:bg-white/5 rounded-3xl my-10">
            <div className="mb-16 max-w-3xl">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                    <Editable text={data.section_title} path="problem.section_title" isStudio />
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    <Editable text={data.main_heading} path="problem.main_heading" isStudio />
                </h3>
                <div className="text-xl text-gray-600 dark:text-gray-300">
                    <Editable text={data.description} path="problem.description" isStudio multiline />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {data.items.map((item, index) => (
                    <div
                        key={index}
                        className="p-8 bg-white dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-white/10 rounded-2xl w-fit">
                                {iconMap[item.icon] || <Box className="w-8 h-8 text-gray-500" />}
                            </div>
                            <ListControls
                                onRemove={() => removeItem('problem.items', index, true)}
                            />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            <Editable text={item.title} path={`problem.items.${index}.title`} isStudio />
                        </h4>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            <Editable text={item.description} path={`problem.items.${index}.description`} isStudio multiline />
                        </div>
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={() => addItem('problem.items', {
                            title: "New Problem",
                            description: "Describe the challenge...",
                            icon: "Box"
                        }, true)}
                        className="p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity min-h-[200px]"
                    >
                        <span className="text-3xl">+</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Item</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default Problem;
