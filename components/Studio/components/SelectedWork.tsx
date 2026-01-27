import React from 'react';
import { SelectedWorkData } from '../types';
import { ArrowRight } from './StudioIcons';

interface SelectedWorkProps {
    data: SelectedWorkData;
}

const SelectedWork: React.FC<SelectedWorkProps> = ({ data }) => {
    return (
        <section id="work" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-20 max-w-3xl">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{data.section_title}</h2>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {data.main_heading}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {data.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
                {data.projects.map((project, index) => (
                    <div key={index} className="group">
                        <div className="relative overflow-hidden rounded-3xl mb-8 aspect-[4/3]">
                            <div className="absolute top-4 left-4 z-10 w-16 h-16 bg-white dark:bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center p-3 shadow-lg border border-gray-100 dark:border-white/10">
                                <img
                                    src={project.logoUrl}
                                    alt={`${project.title} logo`}
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-0">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                                <span className="text-xs uppercase tracking-wider text-gray-500">{project.category}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{project.location}</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed py-2">{project.description}</p>

                            <a
                                href={project.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline pt-2"
                            >
                                {project.linkText} <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <span className="inline-block px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                    {data.footer_text}
                </span>
            </div>
        </section>
    );
};

export default SelectedWork;
