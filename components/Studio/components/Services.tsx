import React from 'react';
import { ServicesData } from '../types';

interface ServicesProps {
    data: ServicesData;
}

const Services: React.FC<ServicesProps> = ({ data }) => {
    return (
        <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{data.section_title}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">{data.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {data.items.map((service, index) => (
                    <div key={index} className="flex flex-col h-full">
                        <div className="h-1 w-12 bg-gray-200 dark:bg-gray-700 mb-6 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 min-h-[3rem]">{service.description}</p>

                        <ul className="space-y-3 mt-auto">
                            {service.list.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-800 dark:text-gray-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
