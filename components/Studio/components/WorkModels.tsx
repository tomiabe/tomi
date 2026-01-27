import React from 'react';
import { WorkModelsData } from '../types';

interface WorkModelsProps {
    data: WorkModelsData;
}

const WorkModels: React.FC<WorkModelsProps> = ({ data }) => {
    return (
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-200 dark:border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-12">{data.section_title}</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {data.models.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-6">
                            {m.role}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{m.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{m.description}</p>
                    </div>
                ))}
            </div>
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
                {data.footer_text}
            </p>
        </section>
    );
};

export default WorkModels;
