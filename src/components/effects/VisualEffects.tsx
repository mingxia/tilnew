'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme, TimeOfDay, TIME_CONFIGS } from '@/contexts/ThemeContext';

// 环境音效 URLs
const SOUNDS: Record<string, string> = {
  dawn: '/audio/dawn.mp3', // 黎明
  morning: '/audio/morning.mp3', // 上午
  noon: '/audio/noon.mp3', // 中午
  afternoon: '/audio/afternoon.mp3', // 下午
  dusk: '/audio/dusk.mp3', // 傍晚
  night: '/audio/night.mp3', // 深夜
};

/**
 * 斑驳光影效果 - 整合 sunlit 的核心技术
 */
export function DappledLight() {
  const { timeConfig } = useTheme();

  return (
    <div id="dappled-light">
      {/* 光晕层 */}
      <div
        id="glow"
        style={{
          background: `linear-gradient(309deg, ${timeConfig.glow}, ${timeConfig.glow} 30%, transparent)`,
          opacity: timeConfig.glowIntensity,
        }}
      />
      <div
        id="glow-bounce"
        style={{
          background: `linear-gradient(355deg, ${timeConfig.glow} 0%, transparent 40%, transparent 100%)`,
          opacity: timeConfig.glowIntensity * 0.8,
        }}
      />

      {/* 树叶和百叶窗容器 */}
      <div
        className="perspective"
        style={{ opacity: timeConfig.leavesOpacity }}
      >
        {/* 树叶层 - 使用 SVG 滤镜实现风吹效果 */}
        <div id="leaves">
          <svg style={{ width: 0, height: 0, position: 'absolute' }}>
            <defs>
              <filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" numOctaves={2} seed={1}>
                  <animate
                    attributeName="baseFrequency"
                    dur="16s"
                    keyTimes="0;0.33;0.66;1"
                    values="0.005 0.003;0.01 0.009;0.008 0.004;0.005 0.003"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic">
                  <animate
                    attributeName="scale"
                    dur="20s"
                    keyTimes="0;0.25;0.5;0.75;1"
                    values="45;55;75;55;45"
                    repeatCount="indefinite"
                  />
                </feDisplacementMap>
              </filter>
            </defs>
          </svg>
        </div>

        {/* 百叶窗效果 - 白天打开，夜晚关闭 */}
        <div id="blinds">
          <div className="shutters" style={{ gap: timeConfig.hasStars ? '20px' : '60px' }}>
            {Array.from({ length: 23 }).map((_, i) => (
              <div
                key={i}
                className="shutter"
                style={{ height: timeConfig.hasStars ? '80px' : '40px' }}
              />
            ))}
          </div>
          <div className="vertical">
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>
      </div>

      {/* 渐进式模糊 - 4 层叠加 */}
      <div id="progressive-blur">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

/**
 * 星空效果 - 只在夜间显示
 */
export function Starfield() {
  const { timeConfig } = useTheme();
  const [stars, setStars] = useState<Array<{
    left: string;
    top: string;
    delay: string;
    width: string;
    height: string;
  }>>([]);

  useEffect(() => {
    const starsData = Array.from({ length: 60 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      delay: `${Math.random() * 4}s`,
      width: `${1 + Math.random() * 2}px`,
      height: `${1 + Math.random() * 2}px`,
    }));
    setStars(starsData);
  }, []);

  if (!timeConfig.hasStars) return null;

  return (
    <div className="starfield starfield-visible">
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            width: star.width,
            height: star.height,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 萤火虫效果 - 黄昏和夜间显示
 */
export function Fireflies() {
  const { timeConfig } = useTheme();
  const [fireflies, setFireflies] = useState<Array<{
    left: string;
    top: string;
    delay: string;
  }>>([]);

  useEffect(() => {
    const firefliesData = Array.from({ length: 12 }).map(() => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: `${Math.random() * 10}s`,
    }));
    setFireflies(firefliesData);
  }, []);

  if (!timeConfig.hasFireflies) return null;

  return (
    <div className="fireflies-container fireflies-visible">
      {fireflies.map((firefly, i) => (
        <div
          key={i}
          className="firefly"
          style={{
            left: firefly.left,
            top: firefly.top,
            animationDelay: firefly.delay,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 环境音效 - 根据时间段播放不同音效
 */
export function AmbientSound() {
  const { timeConfig, audioEnabled } = useTheme();
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 预加载所有音效
    Object.entries(SOUNDS).forEach(([key, url]) => {
      if (!audioRefs.current.has(key)) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0;
        audioRefs.current.set(key, audio);
      }
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const targetVolume = audioEnabled ? 0.25 : 0; // 适中音量 0.15
    const currentSounds = timeConfig.sounds;

    audioRefs.current.forEach((audio, key) => {
      const isCurrentTime = currentSounds.includes(key);

      if (isCurrentTime && audioEnabled) {
        audio.play().catch(() => {});
        const fadeIn = setInterval(() => {
          if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + 0.01, targetVolume);
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      } else {
        const fadeOut = setInterval(() => {
          if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - 0.01, 0);
          } else {
            audio.pause();
            clearInterval(fadeOut);
          }
        }, 100);
      }
    });
  }, [audioEnabled, timeConfig.sounds, loaded]);

  return null;
}
