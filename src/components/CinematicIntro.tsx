import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  videoUrl?: string;
  brokerName?: string;
  creci?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  brokerName = 'Maria Júlia Gamba',
  creci = 'CRECI/SC 77301-F'
}) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animStage, setAnimStage] = useState<'start' | 'writing_maria' | 'writing_julia' | 'monogram' | 'subtitle' | 'shimmer' | 'complete'>('start');
  const finishedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const DURATION_MS = 6200; // 6.2 seconds exact cinematic sequence

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 550);
  }, [onComplete]);

  // High performance RAF timeline (60-120fps hardware accelerated)
  useEffect(() => {
    const onFrame = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed < 1200) {
        setAnimStage('writing_maria');
      } else if (elapsed < 2400) {
        setAnimStage('writing_julia');
      } else if (elapsed < 3400) {
        setAnimStage('monogram');
      } else if (elapsed < 4200) {
        setAnimStage('subtitle');
      } else if (elapsed < 5400) {
        setAnimStage('shimmer');
      } else {
        setAnimStage('complete');
      }

      if (elapsed >= DURATION_MS) {
        handleFinish();
      } else {
        animationFrameRef.current = requestAnimationFrame(onFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(onFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleFinish]);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none transition-opacity duration-700 ease-out will-change-opacity ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#f5f5f6',
        backgroundImage: 'radial-gradient(circle at 50% 45%, #ffffff 0%, #f6f6f7 55%, #e9e9eb 100%)'
      }}
      title="Toque em qualquer lugar para entrar no site"
    >
      {/* Top Controls: Audio & Skip */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-40 flex items-center gap-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          aria-label={isMuted ? 'Áudio da introdução' : 'Silenciar áudio'}
          className="p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-700 border border-neutral-300 shadow-xs backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:shadow-md backdrop-blur-md text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
        >
          <span>Pular introdução</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Luxury 3D Identity Composition */}
      <div className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center">
        
        {/* SVG Defs for 3D Gold and Lighting */}
        <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true">
          <defs>
            {/* Rich 3D Metallic Gold Gradient */}
            <linearGradient id="gold3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="25%" stopColor="#f5e298" />
              <stop offset="50%" stopColor="#c59b27" />
              <stop offset="75%" stopColor="#e8cf78" />
              <stop offset="100%" stopColor="#9a7018" />
            </linearGradient>

            {/* Subtle Specular Highlights */}
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c59b27" />
              <stop offset="40%" stopColor="#fef6cd" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fef6cd" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>

            {/* Bronze Subtitle Gradient */}
            <linearGradient id="bronze3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c5d26" />
              <stop offset="50%" stopColor="#a37c35" />
              <stop offset="100%" stopColor="#5c4419" />
            </linearGradient>

            {/* Realistic 3D Floor Shadow */}
            <filter id="soft3DShadow" x="-30%" y="-30%" width="180%" height="180%">
              <feDropShadow dx="6" dy="10" stdDeviation="6" floodColor="#1a1205" floodOpacity="0.16" />
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#3d2a05" floodOpacity="0.22" />
            </filter>

            {/* Monogram Soft Shadow */}
            <filter id="monogramShadow" x="-40%" y="-40%" width="200%" height="200%">
              <feDropShadow dx="5" dy="9" stdDeviation="5.5" floodColor="#000000" floodOpacity="0.14" />
            </filter>
          </defs>
        </svg>

        {/* 1. TOP INTERTWINED MONOGRAM "MJ" */}
        <div
          className="relative transition-all duration-1000 ease-out flex items-center justify-center will-change-transform will-change-opacity mb-2 sm:mb-3"
          style={{
            opacity: animStage === 'start' || animStage === 'writing_maria' ? 0.05 : 1,
            transform: animStage === 'start' || animStage === 'writing_maria' 
              ? 'translateY(-12px) scale(0.94)' 
              : 'translateY(0px) scale(1)',
            transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <svg
            viewBox="0 0 160 140"
            className="w-24 h-20 sm:w-32 sm:h-28 overflow-visible"
            style={{ filter: 'url(#monogramShadow)' }}
          >
            {/* The Classical Serif "M" */}
            <text
              x="58"
              y="98"
              fontFamily="'Cinzel', serif"
              fontSize="96"
              fontWeight="600"
              fill="url(#gold3D)"
              stroke="#8a6718"
              strokeWidth="0.8"
              letterSpacing="-2"
              textAnchor="middle"
            >
              M
            </text>

            {/* The Slender Intersecting "J" */}
            <text
              x="96"
              y="106"
              fontFamily="'Cinzel', serif"
              fontSize="86"
              fontWeight="500"
              fill="url(#gold3D)"
              stroke="#735212"
              strokeWidth="0.7"
              textAnchor="middle"
              className="drop-shadow-xs"
            >
              J
            </text>

            {/* Micro 3D Highlight Edge on Monogram */}
            <text
              x="57.5"
              y="97.5"
              fontFamily="'Cinzel', serif"
              fontSize="96"
              fontWeight="600"
              fill="none"
              stroke="#fff6d1"
              strokeWidth="0.5"
              letterSpacing="-2"
              textAnchor="middle"
              opacity="0.75"
            >
              M
            </text>
          </svg>
        </div>

        {/* 2. CENTER SIGNATURE: "Maria Julia" IN 3D GOLDEN CALLIGRAPHY */}
        <div className="relative w-full flex items-center justify-center my-1 sm:my-2">
          <svg
            viewBox="0 0 860 210"
            className="w-full max-w-2xl sm:max-w-3xl overflow-visible"
            style={{ filter: 'url(#soft3DShadow)' }}
          >
            <defs>
              {/* Progressive stroke-mask for cursive writing animation */}
              <clipPath id="revealMaria">
                <rect
                  x="0"
                  y="0"
                  height="210"
                  className="transition-all ease-out"
                  style={{
                    width: animStage === 'start' 
                      ? '0%' 
                      : animStage === 'writing_maria' 
                        ? '48%' 
                        : '100%',
                    transitionDuration: animStage === 'writing_maria' ? '1200ms' : '1100ms'
                  }}
                />
              </clipPath>
            </defs>

            {/* 3D Underlayer Shadow Stroke */}
            <g clipPath="url(#revealMaria)" opacity="0.25">
              <text
                x="434"
                y="142"
                fontFamily="'Great Vibes', 'Alex Brush', cursive"
                fontSize="136"
                fontWeight="400"
                fill="#362507"
                textAnchor="middle"
              >
                Maria Julia
              </text>
            </g>

            {/* Golden 3D Main Calligraphy */}
            <g clipPath="url(#revealMaria)">
              <text
                x="430"
                y="136"
                fontFamily="'Great Vibes', 'Alex Brush', cursive"
                fontSize="136"
                fontWeight="400"
                fill="url(#gold3D)"
                stroke="#9a7018"
                strokeWidth="1.2"
                textAnchor="middle"
                className="select-none"
              >
                Maria Julia
              </text>

              {/* Specular White-Gold Inner Ridge for 3D Bevel look */}
              <text
                x="429.5"
                y="135"
                fontFamily="'Great Vibes', 'Alex Brush', cursive"
                fontSize="136"
                fontWeight="400"
                fill="none"
                stroke="#fff8d6"
                strokeWidth="0.8"
                textAnchor="middle"
                opacity="0.7"
              >
                Maria Julia
              </text>
            </g>

            {/* Specular Light Sweep Shimmer Animation */}
            {animStage === 'shimmer' && (
              <g className="animate-shimmer">
                <text
                  x="430"
                  y="136"
                  fontFamily="'Great Vibes', 'Alex Brush', cursive"
                  fontSize="136"
                  fontWeight="400"
                  fill="url(#goldShine)"
                  textAnchor="middle"
                  opacity="0.85"
                >
                  Maria Julia
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 3. SUBTITLE: "CORRETORA DE IMÓVEIS" */}
        <div
          className="relative transition-all duration-1000 ease-out will-change-transform will-change-opacity mt-1 sm:mt-2 text-center"
          style={{
            opacity: animStage === 'start' || animStage === 'writing_maria' || animStage === 'writing_julia' ? 0 : 1,
            transform: animStage === 'start' || animStage === 'writing_maria' || animStage === 'writing_julia'
              ? 'translateY(10px) scale(0.97)'
              : 'translateY(0px) scale(1)',
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <h2
              className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.38em] uppercase select-none"
              style={{
                fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif",
                color: '#6e4f1b',
                textShadow: '0 2px 4px rgba(0,0,0,0.08), 0 1px 1px rgba(255,255,255,0.8)'
              }}
            >
              CORRETORA DE IMÓVEIS
            </h2>

            {/* Subtle CRECI Accreditation */}
            <span
              className="text-[10px] tracking-[0.25em] font-medium uppercase text-neutral-500"
              style={{ fontFamily: "'Cinzel', sans-serif" }}
            >
              {creci} • ALTO PADRÃO & INVESTIMENTOS
            </span>
          </div>
        </div>

      </div>

      {/* Elegant Bottom Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-300/40">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 transition-all duration-100 ease-linear shadow-xs"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 z-20 flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-neutral-500 font-medium">
        <Sparkles className="w-3 h-3 text-amber-500 animate-spin-slow" />
        <span>Toque em qualquer lugar para acessar</span>
      </div>
    </div>
  );
};
