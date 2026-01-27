import React, { useEffect, useState } from 'react';
import { XMark } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-500 ${isOpen ? 'bg-zinc-200/60 dark:bg-black/80 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`
          w-full sm:max-w-3xl 
          max-h-[85vh] sm:h-[85vh] h-auto
          bg-white dark:bg-[#1c1c1e] 
          sm:rounded-2xl rounded-t-2xl 
          shadow-2xl overflow-hidden flex flex-col
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform
          ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 sm:translate-y-10 sm:scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/10 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl sticky top-0 z-10 relative">
          {/* Mobile Drag Handle (Visual Cue) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:hidden"></div>
          
          <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-900 dark:text-white/90 pt-2 sm:pt-0">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-zinc-600 dark:text-white transition-colors duration-200 mt-1 sm:mt-0"
            aria-label="Close"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-10 no-scrollbar">
          <div className="max-w-2xl mx-auto text-zinc-700 dark:text-zinc-200 leading-relaxed space-y-8 animate-fadeIn pb-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;