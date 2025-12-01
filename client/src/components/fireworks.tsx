import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vy_base: number;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
  type: 'rain' | 'explosion';
}

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = particlesRef.current;

    const colors = [
      '#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF',
      '#06FFA5', '#FF4365', '#06D9FF', '#FFD60A'
    ];

    // Lluvia de partículas suave - cae constantemente
    const createRain = () => {
      const rainParticle: Particle = {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.8 + Math.random() * 0.4,
        vy_base: 0.8 + Math.random() * 0.4,
        life: 1,
        maxLife: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 1.5 + Math.random() * 1,
        type: 'rain'
      };
      particles.push(rainParticle);
    };


    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;

        if (p.type === 'rain') {
          p.y += p.vy;
          p.vy = p.vy_base + Math.sin(p.x * 0.01) * 0.2;
        } else {
          p.y += p.vy;
          p.vy += 0.08;
          p.life -= 0.02;
        }

        if (p.y > canvas.height || p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Lluvia continua - 2-3 partículas por frame
    const rainInterval = setInterval(() => {
      createRain();
      if (Math.random() > 0.6) createRain();
    }, 100);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      clearInterval(rainInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      data-testid="canvas-fireworks"
    />
  );
}
