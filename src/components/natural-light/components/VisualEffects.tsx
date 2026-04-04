'use client';

import { useEffect, useRef, useState } from 'react';
import { useNaturalLight } from '../context/ThemeContext';

/**
 * Dappled light effect component
 */
export function DappledLight({ leavesImageUrl }: { leavesImageUrl?: string }) {
  const { timeConfig, effectsEnabled, mounted } = useNaturalLight();
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mounted) return;
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [mounted]);

  if (!mounted || !effectsEnabled) return null;

  return (
    <div id="dappled-light" ref={containerRef}>
      {/* SVG Wind Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              seed="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Glow effect */}
      <div
        id="glow"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 70% 20%, ${timeConfig.glow}${Math.round(timeConfig.glowIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
        }}
      />

      {/* Secondary glow */}
      <div
        id="glow-bounce"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 60% 80%, ${timeConfig.glow}${Math.round(timeConfig.glowIntensity * 0.3 * 255).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
        }}
      />

      {/* Perspective container with leaves */}
      <div className="perspective">
        <div
          id="leaves"
          style={{
            opacity: timeConfig.leavesOpacity,
            backgroundImage: leavesImageUrl ? `url(${leavesImageUrl})` : undefined,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Starfield effect for night time
 */
export function Starfield() {
  const { timeConfig, effectsEnabled, mounted } = useNaturalLight();
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (!mounted) return;
    
    const generatedStars = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1,
    }));
    setStars(generatedStars);
  }, [mounted]);

  if (!mounted || !effectsEnabled || !timeConfig.hasStars) return null;

  return (
    <div className="starfield">
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Fireflies effect for dusk and night
 */
export function Fireflies() {
  const { timeConfig, effectsEnabled, mounted } = useNaturalLight();
  const [fireflies, setFireflies] = useState<Array<{ x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (!mounted) return;
    
    const generatedFireflies = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setFireflies(generatedFireflies);
  }, [mounted]);

  if (!mounted || !effectsEnabled || !timeConfig.hasFireflies) return null;

  return (
    <div className="fireflies">
      {fireflies.map((ff, i) => (
        <div
          key={i}
          className="firefly"
          style={{
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            animationDelay: `${ff.delay}s`,
            animationDuration: `${ff.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ambient sound component
 */
export function AmbientSound() {
  const { audioEnabled, timeConfig } = useNaturalLight();

  if (!audioEnabled) return null;

  return (
    <div data-audio-sounds={timeConfig.sounds.join(',')} style={{ display: 'none' }} />
  );
}

/**
 * Combined visual effects component
 */
export function VisualEffects({ leavesImageUrl }: { leavesImageUrl?: string }) {
  return (
    <>
      <DappledLight leavesImageUrl={leavesImageUrl} />
      <Starfield />
      <Fireflies />
      <AmbientSound />
    </>
  );
}
