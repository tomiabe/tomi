import React from 'react';
import Markdown from 'react-markdown';

interface RichTextProps {
  content: string;
  className?: string;
  accentColor?: string;
}

const RichText: React.FC<RichTextProps> = ({ content, className = "", accentColor = "#3b82f6" }) => {
  if (!content) return null;

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <Markdown
        components={{
          // We destructure node to prevent it from being passed to the DOM element
          // and use any to avoid implicit any errors during the CI/CD build phase
          p: ({ node, ...props }: any) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
          a: ({ node, ...props }: any) => (
            <a 
              className="underline hover:opacity-80 transition-opacity underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600"
              style={{ color: accentColor }}
              target="_blank"
              rel="noopener noreferrer"
              {...props} 
            />
          ),
          h1: ({ node, ...props }: any) => <h1 className="text-3xl font-bold mb-4 mt-8" {...props} />,
          h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mb-3 mt-6" {...props} />,
          h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mb-2 mt-4" {...props} />,
          h4: ({ node, ...props }: any) => <h4 className="text-lg font-bold mb-2 mt-4" {...props} />,
          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
          blockquote: ({ node, ...props }: any) => (
            <blockquote 
              className="border-l-4 pl-4 italic my-6 bg-black/5 dark:bg-white/5 py-2 pr-4 rounded-r-md"
              style={{ borderColor: accentColor }}
              {...props} 
            />
          ),
          strong: ({ node, ...props }: any) => <strong className="font-bold opacity-100 text-black dark:text-white" {...props} />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default RichText;