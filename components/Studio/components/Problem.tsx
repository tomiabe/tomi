import React from 'react';
import { Layers, Box, Maximize2, Minimize2 } from './StudioIcons';
import { ProblemData } from '../types';

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
    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-50 dark:bg-white/5 rounded-3xl my-10">
            <div className="mb-16 max-w-3xl">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{data.section_title}</h2>
                <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    {data.main_heading}
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    {data.description}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {data.items.map((item, index) => (
                    <div
                        key={index}
                        className="p-8 bg-white dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-white/10 rounded-2xl w-fit">
                            {iconMap[item.icon] || <Box className="w-8 h-8 text-gray-500" />}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Problem;
