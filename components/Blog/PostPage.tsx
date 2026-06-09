import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RichText from '../RichText';
import { ChevronLeft } from '../Icons';

interface Post {
  title: string;
  date: string;
  slug: string;
  content: string;
}

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const t = new Date().getTime();
    fetch(`/content/posts/${slug}.json?t=${t}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setPost(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (post?.title) {
      document.title = post.title;
    }
  }, [post]);

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
        <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter mb-4 opacity-5 dark:opacity-10 pointer-events-none select-none">404</h1>
        <div className="space-y-2 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Post Not Found</h2>
          <p className="opacity-50 text-sm md:text-base">This post doesn't exist or has been moved.</p>
        </div>
        <Link
          to="/"
          className="px-10 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/5 dark:shadow-white/5"
        >
          Go Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

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
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        <time className="text-sm font-medium opacity-40 uppercase tracking-widest">
          {formatDate(post.date)}
        </time>
      </header>

      <article className="text-base md:text-lg leading-relaxed opacity-90 space-y-6">
        <RichText content={post.content} />
      </article>

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

export default PostPage;
