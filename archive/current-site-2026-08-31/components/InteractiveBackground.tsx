import React, { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  isDark: boolean;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High-DPI displays for crisp rendering
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    const setCanvasSize = () => {
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(pixelRatio, pixelRatio);
    };

    setCanvasSize();

    let particles: Particle[] = [];

    // Density Calculations
    // Dark Mode: Canvas Area / 15000 (Sparse)
    // Light Mode: Canvas Area / 12000 (More texture)
    const area = width * height;
    const densityFactor = isDark ? 15000 : 12000;
    const particleCount = Math.floor(area / densityFactor);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      rgb: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        if (isDark) {
            // 1. Dark Mode (Night / Stardust Theme)
            // Movement: Drifts horizontally to the left (Earth's rotation).
            // Velocity: Slow (0.05 to 0.25)
            this.vx = -1 * (Math.random() * 0.20 + 0.05); 
            this.vy = (Math.random() - 0.5) * 0.02; // Minimal vertical drift for realism
            
            // Size: Small and crisp (0.3px to 1.5px)
            this.size = Math.random() * 1.2 + 0.3;
            
            // Color: Pure White with varying opacity (0.1 to 0.6)
            this.baseAlpha = Math.random() * 0.5 + 0.1;
            this.rgb = '255, 255, 255';
        } else {
            // 2. Light Mode (Day / Sun Motes Theme)
            // Movement: Floats vertically upwards (Heat rising).
            // Velocity: Slightly faster (0.1 to 0.5)
            this.vx = (Math.random() - 0.5) * 0.2; // Slight horizontal sway
            this.vy = -1 * (Math.random() * 0.4 + 0.1); // Upward movement
            
            // Size: Larger and softer (1px to 4px)
            this.size = Math.random() * 3 + 1;
            
            // Opacity: Very subtle (0.05 to 0.2)
            this.baseAlpha = Math.random() * 0.15 + 0.05; 

            // Color: Warm Amber (60%) and Apple Blue (40%)
            if (Math.random() < 0.6) {
                this.rgb = '255, 170, 80'; // Warm Amber
            } else {
                this.rgb = '100, 160, 255'; // Soft Apple Blue
            }
        }
        this.alpha = this.baseAlpha;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen logic
        if (this.x < -10) this.x = width + 10; // Left drift wrap
        if (this.x > width + 10) this.x = -10;
        
        if (this.y < -10) this.y = height + 10; // Upward float wrap
        if (this.y > height + 10) this.y = -10;

        // Mouse interaction (Fluid repulsion)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * force * 2;
            const moveY = Math.sin(angle) * force * 2;
            
            this.x -= moveX;
            this.y -= moveY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.rgb}, ${this.alpha})`;
        ctx.fill();
      }
    }

    const init = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update(mouseX, mouseY);
            p.draw();
        });
        requestAnimationFrame(animate);
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        setCanvasSize();
        init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove);
    
    init();
    const animId = requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(animId);
    };
  }, [isDark]);

  return (
    <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{ opacity: isDark ? 1 : 1 }} // Opacity handled at particle level
    />
  );
};

export default InteractiveBackground;