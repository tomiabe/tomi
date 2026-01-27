import React from 'react';
import { AboutData } from '../types';

interface AboutProps {
    data: AboutData;
}

const About: React.FC<AboutProps> = ({ data }) => {
    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto bg-gray-50 dark:bg-[#0c0c0c] rounded-[3rem] my-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="order-2 lg:order-1 space-y-8">
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{data.section_title}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            {data.main_heading}
                        </h3>
                    </div>

                    <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {data.intro_paragraphs.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">{data.speaking_title}</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3 list-disc list-inside">
                            {data.speaking_items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Image - Placed to visually align with "Talking about me" */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={data.image_url}
                            alt={data.name}
                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                            <p className="text-white font-medium text-lg">{data.name}</p>
                            <p className="text-white/60 text-sm">{data.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
