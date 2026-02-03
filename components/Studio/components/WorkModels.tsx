import React from 'react';
import { WorkModelsData } from '../types';
import { Editable } from '../../Editor/Editable';
import { useEditor } from '../../Editor/EditorContext';
import { ListControls } from '../../Editor/ListControls';

interface WorkModelsProps {
    data: WorkModelsData;
}

const WorkModels: React.FC<WorkModelsProps> = ({ data }) => {
    const { addItem, removeItem, isEditMode } = useEditor();

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-200 dark:border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-12">
                <Editable text={data.section_title} path="workModels.section_title" isStudio />
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {data.models.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors relative group">
                        <div className="flex justify-between items-start mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                <Editable text={m.role} path={`workModels.models.${i}.role`} isStudio />
                            </span>
                            <ListControls
                                onRemove={() => removeItem('workModels.models', i, true)}
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            <Editable text={m.title} path={`workModels.models.${i}.title`} isStudio />
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400">
                            <Editable text={m.description} path={`workModels.models.${i}.description`} isStudio multiline />
                        </div>
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={() => addItem('workModels.models', {
                            role: "New Role",
                            title: "New Model",
                            description: "Model description..."
                        }, true)}
                        className="py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-3xl">+</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Model</span>
                    </button>
                )}
            </div>
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
                <Editable text={data.footer_text} path="workModels.footer_text" isStudio />
            </div>
        </section>
    );
};

export default WorkModels;
