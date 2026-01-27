import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface InteractiveBackgroundProps {
    theme: Theme;
}

interface Particle {
    x: number;
    y: number;
    radius: number;
    baseX: number;
    baseY: number;
    density: number;
    color: string;
    angle: number;
    velocity: number;
}

const StudioInteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            const particles: Particle[] = [];
            const canvasArea = canvas.width * canvas.height;

            // Configuration based on theme
            const isDark = theme === Theme.DARK;
            const densityDivisor = isDark ? 15000 : 12000; // Slightly more particles in light mode for texture
            const numberOfParticles = canvasArea / densityDivisor;

            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                let color, size, velocity;

                if (isDark) {
                    // Night: Stardust (Crisp, white, small)
                    size = Math.random() * 1.2 + 0.3;
                    color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
                    velocity = Math.random() * 0.2 + 0.05;
                } else {
                    // Day: Sun Motes (Soft, warm/cool mix, slightly larger)
                    size = Math.random() * 3 + 1; // Larger, softer look
                    // Mix of Apple Blue and Warm Amber/Gold for a "Sunlight" feel
                    const isWarm = Math.random() > 0.4; // 60% warm, 40% cool
                    if (isWarm) {
                        // Warm Amber/Gold
                        color = `rgba(245, 158, 11, ${Math.random() * 0.15 + 0.05})`;
                    } else {
                        // Apple Blue (Sky)
                        color = `rgba(59, 130, 246, ${Math.random() * 0.15 + 0.05})`;
                    }
                    velocity = Math.random() * 0.4 + 0.1; // Slightly faster (rising heat)
                }

                particles.push({
                    x,
                    y,
                    radius: size,
                    baseX: x,
                    baseY: y,
                    density: (Math.random() * 20) + 1,
                    color: color,
                    angle: Math.random() * 360,
                    velocity: velocity
                });
            }
            particlesRef.current = particles;
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const mouseX = mouseRef.current.x || centerX;
            const mouseY = mouseRef.current.y || centerY;

            const parallaxX = (mouseX - centerX) * 0.01;
            const parallaxY = (mouseY - centerY) * 0.01;

            particlesRef.current.forEach(particle => {
                // 1. Natural Wave Motion (Bobbing)
                particle.angle += 0.005;
                const waveX = Math.cos(particle.angle) * 10;
                const waveY = Math.sin(particle.angle) * 10;

                // 2. Directional Flow
                if (theme === Theme.DARK) {
                    // Night: Drift Left (Earth rotation feel)
                    particle.baseX -= particle.velocity;
                    // Wrap horizontally
                    if (particle.baseX < -20) particle.baseX = canvas.width + 20;
                    if (particle.baseX > canvas.width + 20) particle.baseX = -20;
                } else {
                    // Day: Rise Up (Heat/Air feel)
                    particle.baseY -= particle.velocity;
                    // Wrap vertically
                    if (particle.baseY < -20) particle.baseY = canvas.height + 20;
                    if (particle.baseY > canvas.height + 20) particle.baseY = -20;
                }

                // 3. Mouse Interaction (Fluid Repulsion)
                let dx = 0;
                let dy = 0;

                if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
                    // Calculate distance based on particle's current calculated position
                    const pX = particle.baseX + waveX;
                    const pY = particle.baseY + waveY;

                    const distDx = mouseRef.current.x - pX;
                    const distDy = mouseRef.current.y - pY;
                    const distance = Math.sqrt(distDx * distDx + distDy * distDy);

                    const interactionRadius = 150; // Slightly larger radius for softer feel

                    if (distance < interactionRadius) {
                        const forceDirectionX = distDx / distance;
                        const forceDirectionY = distDy / distance;
                        const force = (interactionRadius - distance) / interactionRadius;

                        // Gentle push
                        dx = -forceDirectionX * force * particle.density * 0.6;
                        dy = -forceDirectionY * force * particle.density * 0.6;
                    }
                }

                // 4. Final Position Calculation
                // Base + Wave + Mouse + Parallax
                const finalX = particle.baseX + waveX + dx - (parallaxX * particle.density * 0.1);
                const finalY = particle.baseY + waveY + dy - (parallaxY * particle.density * 0.1);

                ctx.beginPath();
                ctx.arc(finalX, finalY, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current = { x: event.clientX, y: event.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: null, y: null };
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(requestRef.current);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
};

export default StudioInteractiveBackground;
