import React from 'react';
import { StudioContent, SiteSettings } from '../../types';
import { ArrowUpRight } from '../Icons';
import RichText from '../RichText';

interface StudioPageProps {
  content: StudioContent;
  settings: SiteSettings;
}

const StudioPage: React.FC<StudioPageProps> = ({ content, settings }) => {
  const accentColor = settings?.accentColor || '#3b82f6';

  return (
    <div className="min-h-screen pt-24 pb-20">
      
      {/* 1. Hero */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-32 fade-in">
         <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {content.hero.headline}
            </h1>
            <div className="text-xl md:text-2xl font-light opacity-80 mb-8 leading-relaxed max-w-2xl">
              <RichText content={content.hero.subheadline} accentColor={accentColor} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                 onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}
                 className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                 {content.hero.ctaPrimary}
              </button>
              <button 
                 onClick={() => document.getElementById('work')?.scrollIntoView({behavior: 'smooth'})}
                 className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                 {content.hero.ctaSecondary}
              </button>
            </div>
         </div>
      </section>

      {/* 2. Problem */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-32">
         <div className="grid lg:grid-cols-2 gap-16">
            <div>
               <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">{content.problem.title}</h2>
               <div className="text-2xl md:text-3xl leading-relaxed font-light">
                  <RichText content={content.problem.subtitle} accentColor={accentColor} />
               </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
               {content.problem.items.map((item, idx) => (
                  <div key={idx}>
                     <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                     <div className="opacity-70 leading-relaxed">
                        <RichText content={item.description} accentColor={accentColor} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Approach */}
      <section id="approach" className="px-6 lg:px-8 max-w-7xl mx-auto mb-32 scroll-mt-24">
         <div className="grid lg:grid-cols-12 gap-12 border-t border-black/10 dark:border-white/10 pt-16">
            <div className="lg:col-span-5 sticky top-32 self-start">
               <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">{content.approach.title}</h2>
               <h3 className="text-3xl font-bold mb-6">{content.approach.subtitle}</h3>
               <div className="text-lg opacity-80 leading-relaxed">
                  <RichText content={content.approach.description} accentColor={accentColor} />
               </div>
            </div>
            <div className="lg:col-span-1"></div>
            <div className="lg:col-span-6 space-y-12">
               {content.approach.systems.map((sys, idx) => (
                  <div key={idx} className="bg-black/5 dark:bg-white/5 p-8 rounded-2xl">
                     <h4 className="text-xl font-bold mb-3">{sys.title}</h4>
                     <div className="opacity-70 leading-relaxed">
                        <RichText content={sys.description} accentColor={accentColor} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="px-6 lg:px-8 max-w-7xl mx-auto mb-32 scroll-mt-24">
          <div className="border-t border-black/10 dark:border-white/10 pt-16">
             <div className="mb-16 max-w-2xl">
                <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">What I Help Design</h2>
                <div className="text-2xl opacity-90">
                   <RichText content={content.services.description} accentColor={accentColor} />
                </div>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                {content.services.items.map((service, idx) => (
                   <div key={idx}>
                      <h3 className="text-xl font-bold mb-4 pb-4 border-b border-black/10 dark:border-white/10" style={{ color: accentColor }}>
                         {service.title}
                      </h3>
                      <div className="opacity-60 text-sm mb-6 min-h-[40px]">
                         <RichText content={service.description} accentColor={accentColor} />
                      </div>
                      <ul className="space-y-3">
                         {service.subItems.map((sub, sIdx) => (
                            <li key={sIdx} className="flex items-center text-sm opacity-90">
                               <span className="mr-2 opacity-50">•</span> {sub}
                            </li>
                         ))}
                      </ul>
                   </div>
                ))}
             </div>
          </div>
      </section>

      {/* 5. Work Models */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-32">
         <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-12">How I Work</h2>
            <div className="grid md:grid-cols-3 gap-12">
               {content.workModels.items.map((model, idx) => (
                  <div key={idx}>
                     <h4 className="text-xs uppercase tracking-widest opacity-50 mb-2">{model.title}</h4>
                     <h3 className="text-xl font-bold mb-4">{model.role}</h3>
                     <div className="opacity-80 leading-relaxed text-sm">
                        <RichText content={model.description} accentColor={accentColor} />
                     </div>
                  </div>
               ))}
            </div>
            <p className="mt-12 text-center text-sm opacity-50 border-t border-black/5 dark:border-white/5 pt-8">
               Each model is scoped intentionally—no unnecessary layers, no inflated teams.
            </p>
         </div>
      </section>

      {/* 6. Selected Work */}
      <section id="work" className="px-6 lg:px-8 max-w-7xl mx-auto mb-32 scroll-mt-24">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/10 dark:border-white/10 pb-8">
            <div>
               <h2 className="text-3xl font-bold mb-4">Selected Work</h2>
               <p className="opacity-60">Each project reflects a different context, but the same underlying approach.</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0 justify-end max-w-md">
               {content.selectedWork.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full opacity-70">
                     {tag}
                  </span>
               ))}
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
            {content.selectedWork.projects.map((proj) => (
               <div key={proj.id} className="group">
                  <div className="aspect-video bg-black/5 dark:bg-white/5 rounded-xl mb-6 overflow-hidden relative">
                     {/* Placeholder for project image/logo */}
                     <div className="absolute inset-0 flex items-center justify-center p-12">
                        {proj.logoUrl ? (
                           <img src={proj.logoUrl} alt={proj.title} className="w-full h-full object-contain opacity-80 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                           <span className="text-4xl font-bold opacity-20">{proj.title[0]}</span>
                        )}
                     </div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-2xl font-bold">{proj.title}</h3>
                     <a href={proj.linkUrl} className="text-sm font-medium hover:underline flex items-center" style={{ color: accentColor }}>
                        {proj.linkText} <ArrowUpRight className="w-4 h-4 ml-1" />
                     </a>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3">{proj.category}</p>
                  <div className="opacity-80 leading-relaxed mb-4">
                     <RichText content={proj.description} accentColor={accentColor} />
                  </div>
               </div>
            ))}
         </div>
         <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
               More work available upon request <ArrowRight className="w-4 h-4 ml-2" />
            </a>
         </div>
      </section>

      {/* 7. About */}
      <section id="about" className="px-6 lg:px-8 max-w-7xl mx-auto mb-32 scroll-mt-24">
         <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
               <div className="p-8 lg:p-16 flex flex-col justify-center">
                  <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-8">About Tomi</h2>
                  <p className="text-xl font-medium mb-6">{content.about.bio}</p>
                  <div className="opacity-70 leading-relaxed mb-8">
                     <RichText content={content.about.description} accentColor={accentColor} />
                  </div>
                  
                  <div className="border-t border-black/10 dark:border-white/10 pt-8 mt-auto">
                     <h3 className="text-sm font-bold mb-4">Speaking, Training & Mentorship</h3>
                     <ul className="space-y-2">
                        {content.about.mentorshipItems.map((item, idx) => (
                           <li key={idx} className="text-sm opacity-80 flex items-start">
                              <span className="mr-2 opacity-50 mt-1.5 text-[8px]">●</span>
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
               <div className="relative h-64 lg:h-auto bg-zinc-200 dark:bg-zinc-800">
                  <img src={content.about.avatar} alt={content.about.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                     <h3 className="text-xl font-bold">{content.about.name}</h3>
                     <p className="opacity-80 text-sm">{content.about.role}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. Contact */}
      <section id="contact" className="px-6 lg:px-8 max-w-7xl mx-auto mb-20 scroll-mt-24">
         <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">{content.contact.title}</h2>
            <div className="text-xl opacity-70 mb-10">
               <RichText content={content.contact.description} accentColor={accentColor} />
            </div>
            
            <a 
               href={`mailto:${content.contact.email}`} 
               className="inline-block px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg mb-12"
            >
               Book a Conversation
            </a>

            <div className="flex flex-col gap-2 items-center text-sm opacity-60">
               <a href={`mailto:${content.contact.email}`} className="hover:opacity-100 transition-opacity">{content.contact.email}</a>
               <span>{content.contact.location}</span>
            </div>

            <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
               <span>&copy; {new Date().getFullYear()} {settings.siteTitle}. All rights reserved.</span>
               <a href="/" className="hover:opacity-100 transition-opacity font-medium">Back to Personal Site</a>
               <span className="font-medium tracking-widest">{content.contact.footerText}</span>
            </div>
         </div>
      </section>

    </div>
  );
};

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default StudioPage;