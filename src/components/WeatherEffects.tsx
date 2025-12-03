'use client';

import { useEffect, useState, useRef } from 'react';

interface WeatherEffectsProps {
  weatherCode: number | undefined;
}

interface Particle {
  id: string;
  left: number;
  length: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function WeatherEffects({ weatherCode }: WeatherEffectsProps) {
  const [showEffects, setShowEffects] = useState(false);
  const [effectType, setEffectType] = useState<'snow' | 'rain' | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const snowCodes = [71, 73, 75, 77, 85, 86];
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];

  const createRainParticles = (count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `rain-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        left: Math.random() * 100,
        length: Math.random() * 20 + 10,
        duration: Math.random() * 0.8 + 0.4,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    return newParticles;
  };

  const createSnowParticles = (count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `snow-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        left: Math.random() * 100,
        length: Math.random() * 8 + 4, 
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    return newParticles;
  };

  useEffect(() => {
    if (!weatherCode) {
      setTimeout(() => {
        setShowEffects(false);
        setEffectType(null);
      }, 1000);
      return;
    }

    const isSnow = snowCodes.includes(weatherCode);
    const isRain = rainCodes.includes(weatherCode);

    if (isSnow || isRain) {
      const newEffectType = isSnow ? 'snow' : 'rain';
      
      if (newEffectType === effectType && showEffects) {
        return;
      }

      setEffectType(newEffectType);
    
      let particleCount = 50;
      if (newEffectType === 'snow') {
        if ([71, 77].includes(weatherCode)) particleCount = 30;
        else if ([73, 85].includes(weatherCode)) particleCount = 70;
        else particleCount = 120;
        
        const snowParticles = createSnowParticles(particleCount);
        setParticles(snowParticles);
        particlesRef.current = snowParticles;
      } else {
        if ([51, 56, 80].includes(weatherCode)) particleCount = 40;
        else if ([53, 57, 61, 66, 81].includes(weatherCode)) particleCount = 80;
        else particleCount = 150;
        
        const rainParticles = createRainParticles(particleCount);
        setParticles(rainParticles);
        particlesRef.current = rainParticles;
      }
      
      setShowEffects(true);
    } else {
      const timer = setTimeout(() => {
        setShowEffects(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [weatherCode]);

  if (!showEffects || !effectType || particles.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 10,
      overflow: 'hidden',
      opacity: showEffects ? 1 : 0,
      transition: 'opacity 1s ease-in-out'
    }}>
      {particles.map((particle) => {
        if (effectType === 'snow') {
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                top: '-20px',
                left: `${particle.left}vw`,
                width: `${particle.length}px`,
                height: `${particle.length}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
                opacity: particle.opacity,
                filter: 'blur(1px)',
                animation: `fallSnow ${particle.duration}s linear ${particle.delay}s infinite`,
                animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          );
        } else {
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                top: '-30px',
                left: `${particle.left}vw`,
                width: '1.5px',
                height: `${particle.length}px`,
                background: 'linear-gradient(to bottom, transparent, rgba(100, 150, 255, 0.8))',
                opacity: particle.opacity,
                animation: `fallRain ${particle.duration}s linear ${particle.delay}s infinite`,
                boxShadow: '0 0 8px rgba(100, 150, 255, 0.5)',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity' 
              }}
            />
          );
        }
      })}
      
      <style jsx global>{`
        @keyframes fallSnow {
          0% {
            transform: translateY(-20px) translateX(0) translateZ(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(20px) translateZ(0);
            opacity: 0;
          }
        }
        
        @keyframes fallRain {
          0% {
            transform: translateY(-30px) translateZ(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateZ(0);
            opacity: 0;
          }
        }
        
        /* Для плавной анимации */
        * {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}