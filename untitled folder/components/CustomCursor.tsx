import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs for buttery smooth motion without React re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const handleInteractionStart = () => setIsHovering(true);
    const handleInteractionEnd = () => setIsHovering(false);

    // Dynamic detection of interactive elements
    const updateInteractions = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .cursor-pointer, .group');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleInteractionStart);
        el.addEventListener('mouseleave', handleInteractionEnd);
      });
    };

    // Linear interpolation for smooth lag/follow effect
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const render = () => {
      // 0.15 provides a soft, responsive follow
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.15);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      }
      
      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);

    updateInteractions();
    const observer = new MutationObserver(updateInteractions);
    observer.observe(document.body, { childList: true, subtree: true });

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, [isVisible]);

  // Disable on mobile/touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`
          relative -left-1/2 -top-1/2 rounded-full border border-white mix-blend-difference 
          transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isHovering 
            ? 'w-10 h-10 bg-white/10 border-white/40 scale-110' 
            : 'w-6 h-6 bg-transparent border-white/30'
          }
        `}
        style={{
          // Use a slight shadow for extra definition in light mode without being "flashy"
          boxShadow: isHovering ? '0 0 10px rgba(255,255,255,0.1)' : 'none',
        }}
      />
    </div>
  );
};

export default CustomCursor;