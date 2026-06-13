import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowUpRight } from './Icons';
import { SiteContent } from '../types';

interface UpdatesPageProps {
  content: SiteContent;
}

const UpdatesPage: React.FC<UpdatesPageProps> = ({ content }) => {
  const updates = content.updates || [];
  const accentColor = content.settings?.accentColor || '#3b82f6';

  useEffect(() => {
    document.title = 'Updates — Tomi Abe';
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20 relative z-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity mb-12 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back home
      </Link>

      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 leading-tight">
          Updates
        </h1>
        <p className="text-lg opacity-60 font-light">
          A curated list of things I've written, built, or shared.
        </p>
      </header>

      {updates.length === 0 && (
        <p className="opacity-40">No updates yet.</p>
      )}

      <div className="space-y-2">
        {updates.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-4 -mx-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base font-semibold group-hover:opacity-100 transition-opacity truncate" style={{ color: accentColor }}>
                  {item.title}
                </span>
                {item.label && (
                  <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-current opacity-40">
                    {item.label}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-60 leading-relaxed">{item.description}</p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
              <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity" />
              <span className="text-[11px] font-medium opacity-40 whitespace-nowrap">{item.date}</span>
            </div>
          </a>
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t border-black/10 dark:border-white/10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back home
        </Link>
      </footer>
    </div>
  );
};

export default UpdatesPage;
