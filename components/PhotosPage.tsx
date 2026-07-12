import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, XMark } from './Icons';

type ViewMode = 'grid' | 'list';

type Photo = {
  id: string;
  src: string;
  title: string;
  category: 'Portraits' | 'Fragments' | 'Places';
  note: string;
  year: string;
  position?: string;
};

const photos: Photo[] = [
  {
    id: 'untitled-01',
    src: '/images/img_0371_vsco.jpeg',
    title: 'Untitled 01',
    category: 'Portraits',
    note: 'Light, presence, and the pause between frames.',
    year: '2024',
  },
  {
    id: 'untitled-02',
    src: '/images/2f344373-56d2-4db0-a6e1-c71d2886daa2.jpeg',
    title: 'Untitled 02',
    category: 'Fragments',
    note: 'A small study in texture and repetition.',
    year: '2024',
  },
  {
    id: 'untitled-03',
    src: '/images/3d6d20ff-3b77-41c0-b542-df3dfd237612.jpeg',
    title: 'Untitled 03',
    category: 'Places',
    note: 'Found while moving through the city.',
    year: '2023',
  },
  {
    id: 'untitled-04',
    src: '/images/429baf2c-8d36-4af8-9cad-c797c1aaadc4.jpeg',
    title: 'Untitled 04',
    category: 'Fragments',
    note: 'Colour, shadow, and a little bit of chance.',
    year: '2023',
  },
  {
    id: 'untitled-05',
    src: '/images/60794521-180e-4c33-a100-82e65856adbb.jpeg',
    title: 'Untitled 05',
    category: 'Places',
    note: 'A quiet corner worth keeping.',
    year: '2022',
  },
];

const categories = ['All', 'Portraits', 'Fragments', 'Places'] as const;
type Category = (typeof categories)[number];

const PhotosPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const visiblePhotos = activeCategory === 'All'
    ? photos
    : photos.filter((photo) => photo.category === activeCategory);
  const selectedIndex = selectedPhoto ? visiblePhotos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;

  useEffect(() => {
    document.title = 'Photos — Tomi Abe';
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
      if (event.key === 'ArrowRight') {
        setSelectedPhoto(visiblePhotos[(selectedIndex + 1) % visiblePhotos.length]);
      }
      if (event.key === 'ArrowLeft') {
        setSelectedPhoto(visiblePhotos[(selectedIndex - 1 + visiblePhotos.length) % visiblePhotos.length]);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto, selectedIndex, visiblePhotos]);

  return (
    <div className="min-h-screen px-6 py-8 md:px-10 lg:px-16 lg:py-12 relative z-10">
      <header className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back home
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.22em] opacity-40">05 studies</span>
        </div>

        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-45 mb-5">A visual notebook</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-6">Photos</h1>
          <p className="text-lg md:text-xl leading-relaxed opacity-60 font-light max-w-2xl">
            A first collection of images, gathered slowly. The full archive can grow into a set of different ways to look, wander, and stay with a frame.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2 flex-wrap" aria-label="Filter photos by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => { setActiveCategory(category); setSelectedPhoto(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === category ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/5 dark:bg-white/10 opacity-55 hover:opacity-100'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold">
            <span className="opacity-40 mr-2">View</span>
            {(['grid', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-full capitalize transition-colors ${viewMode === mode ? 'bg-black/10 dark:bg-white/15 opacity-100' : 'opacity-45 hover:opacity-100'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-8 pb-20">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
            {visiblePhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className={`group text-left ${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'} ${index === 0 ? 'sm:col-span-2' : ''}`}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-black/5 dark:bg-white/10 ${index === 0 ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
                  <img src={photo.src} alt={photo.title} className={`w-full h-full object-cover transition duration-700 group-hover:scale-[1.03] ${photo.position || ''}`} loading={index > 1 ? 'lazy' : 'eager'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{photo.title}</p>
                        <p className="text-xs opacity-70 mt-1">{photo.category} · {photo.year}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 pt-3 text-xs">
                  <span className="font-semibold">{photo.title}</span>
                  <span className="opacity-40">{photo.category}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10 border-y border-black/10 dark:border-white/10">
            {visiblePhotos.map((photo, index) => (
              <button key={photo.id} type="button" onClick={() => setSelectedPhoto(photo)} className="group w-full text-left py-5 flex items-center gap-5 md:gap-8">
                <span className="w-8 text-xs opacity-35">0{index + 1}</span>
                <img src={photo.src} alt="" className="w-20 h-20 md:w-28 md:h-20 object-cover rounded-lg grayscale group-hover:grayscale-0 transition duration-500" />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold mb-1">{photo.title}</span>
                  <span className="block text-sm opacity-50 truncate">{photo.note}</span>
                </span>
                <span className="hidden sm:block text-xs opacity-40">{photo.category} · {photo.year}</span>
                <ArrowRight className="w-4 h-4 opacity-35 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs opacity-45">
        <span>Five images for now. More ways of seeing, next.</span>
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-100 transition-opacity">Tomi Abe <ArrowRight className="w-3 h-3" /></Link>
      </footer>

      {selectedPhoto && (
        <div className="fixed inset-0 z-[60] bg-black/95 text-white p-5 md:p-8 flex flex-col" role="dialog" aria-modal="true" aria-label={selectedPhoto.title} onClick={() => setSelectedPhoto(null)}>
          <div className="flex items-center justify-between text-xs opacity-70">
            <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(visiblePhotos.length).padStart(2, '0')}</span>
            <button type="button" aria-label="Close photo viewer" onClick={() => setSelectedPhoto(null)} className="p-2 hover:opacity-100 opacity-70 transition-opacity"><XMark className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center gap-3 md:gap-8" onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label="Previous photo" onClick={() => setSelectedPhoto(visiblePhotos[(selectedIndex - 1 + visiblePhotos.length) % visiblePhotos.length])} className="p-2 opacity-50 hover:opacity-100 transition-opacity"><ChevronLeft className="w-7 h-7" /></button>
            <figure className="max-w-5xl max-h-full flex flex-col items-center">
              <img src={selectedPhoto.src} alt={selectedPhoto.title} className="max-h-[70vh] md:max-h-[76vh] max-w-full object-contain rounded-lg" />
              <figcaption className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-5">
                <div>
                  <h2 className="font-semibold">{selectedPhoto.title}</h2>
                  <p className="text-sm opacity-55 mt-1">{selectedPhoto.note}</p>
                </div>
                <span className="text-xs opacity-45">{selectedPhoto.category} · {selectedPhoto.year}</span>
              </figcaption>
            </figure>
            <button type="button" aria-label="Next photo" onClick={() => setSelectedPhoto(visiblePhotos[(selectedIndex + 1) % visiblePhotos.length])} className="p-2 opacity-50 hover:opacity-100 transition-opacity"><ChevronRight className="w-7 h-7" /></button>
          </div>
          <p className="text-center text-[11px] opacity-40">Use ← → to browse · Esc to close</p>
        </div>
      )}
    </div>
  );
};

export default PhotosPage;
