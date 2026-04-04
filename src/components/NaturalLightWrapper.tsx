import { useState, useEffect } from 'react';

// 类型定义
type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';

interface TimeConfig {
  name: string;
  nameEn: string;
  timeRange: string;
  bg: string;
  fg: string;
  glow: string;
  glowIntensity: number;
  leavesOpacity: number;
  hasStars: boolean;
  hasFireflies: boolean;
}

const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  dawn: {
    name: '黎明',
    nameEn: 'Dawn',
    timeRange: '05:00 - 07:00',
    bg: '#2d1f3d',
    fg: '#f0e6d3',
    glow: '#ff9966',
    glowIntensity: 0.5,
    leavesOpacity: 0.6,
    hasStars: true,
    hasFireflies: false,
  },
  morning: {
    name: '上午',
    nameEn: 'Morning',
    timeRange: '07:00 - 11:00',
    bg: '#fff8f0',
    fg: '#2d2418',
    glow: '#ffcc80',
    glowIntensity: 0.7,
    leavesOpacity: 0.55,
    hasStars: false,
    hasFireflies: false,
  },
  noon: {
    name: '中午',
    nameEn: 'Noon',
    timeRange: '11:00 - 14:00',
    bg: '#fffdfa',
    fg: '#1a1612',
    glow: '#fff5e6',
    glowIntensity: 0.9,
    leavesOpacity: 0.5,
    hasStars: false,
    hasFireflies: false,
  },
  afternoon: {
    name: '下午',
    nameEn: 'Afternoon',
    timeRange: '14:00 - 17:00',
    bg: '#fef6e8',
    fg: '#2d2010',
    glow: '#ffd699',
    glowIntensity: 0.8,
    leavesOpacity: 0.55,
    hasStars: false,
    hasFireflies: false,
  },
  dusk: {
    name: '傍晚',
    nameEn: 'Dusk',
    timeRange: '17:00 - 20:00',
    bg: '#e8734a',
    fg: '#fff5e6',
    glow: '#ff6b35',
    glowIntensity: 0.6,
    leavesOpacity: 0.6,
    hasStars: false,
    hasFireflies: true,
  },
  night: {
    name: '深夜',
    nameEn: 'Night',
    timeRange: '20:00 - 05:00',
    bg: '#0f131c',
    fg: '#d0d0d0',
    glow: '#4a5568',
    glowIntensity: 0.3,
    leavesOpacity: 0.7,
    hasStars: true,
    hasFireflies: true,
  },
};

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

export function NaturalLightWrapper() {
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewTimeOfDay, setPreviewTimeOfDay] = useState<TimeOfDay | null>(null);

  const currentTimeOfDay = previewMode && previewTimeOfDay ? previewTimeOfDay : timeOfDay;
  const timeConfig = TIME_CONFIGS[currentTimeOfDay];

  // 注入全局动画样式
  useEffect(() => {
    if (!mounted) return;

    const styleId = 'natural-light-animations';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @keyframes natural-light-glow-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.02); }
      }

      @keyframes natural-light-spot-float-1 {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.15; }
        50% { transform: translate3d(20px, -20px, 0) scale(1.1); opacity: 0.25; }
      }

      @keyframes natural-light-spot-float-2 {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.15; }
        50% { transform: translate3d(-15px, -25px, 0) scale(1.15); opacity: 0.25; }
      }

      @keyframes natural-light-spot-float-3 {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.15; }
        50% { transform: translate3d(25px, -10px, 0) scale(1.1); opacity: 0.25; }
      }

      @keyframes natural-light-big-spot-pulse {
        0%, 100% { opacity: 0.15; transform: scale(1); }
        50% { opacity: 0.25; transform: scale(1.1); }
      }

      @keyframes natural-light-twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }

      @keyframes natural-light-firefly-float-1 {
        0%, 100% { transform: translate3d(0, 0, 0); }
        25% { transform: translate3d(30px, -40px, 0); }
        50% { transform: translate3d(-15px, -60px, 0); }
        75% { transform: translate3d(45px, -25px, 0); }
      }

      @keyframes natural-light-firefly-float-2 {
        0%, 100% { transform: translate3d(0, 0, 0); }
        25% { transform: translate3d(-20px, -30px, 0); }
        50% { transform: translate3d(25px, -50px, 0); }
        75% { transform: translate3d(-35px, -20px, 0); }
      }

      @keyframes natural-light-firefly-glow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }

      #dappled-light .glow-layer {
        animation: natural-light-glow-pulse 8s ease-in-out infinite;
      }

      #dappled-light .spot-1 { animation: natural-light-spot-float-1 7s ease-in-out infinite; }
      #dappled-light .spot-2 { animation: natural-light-spot-float-2 8s ease-in-out infinite; }
      #dappled-light .spot-3 { animation: natural-light-spot-float-3 9s ease-in-out infinite; }
      #dappled-light .big-spot { animation: natural-light-big-spot-pulse 6s ease-in-out infinite; }
      
      .star { animation: natural-light-twinkle 3s ease-in-out infinite; }
      .firefly { animation: natural-light-firefly-glow 2s ease-in-out infinite alternate; }
      .firefly-float-1 { animation: natural-light-firefly-float-1 8s ease-in-out infinite; }
      .firefly-float-2 { animation: natural-light-firefly-float-2 10s ease-in-out infinite; }
    `;

    return () => {
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
    };
  }, [mounted]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setTimeOfDay(getTimeOfDay(hour));
    };

    setMounted(true);
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.backgroundColor = timeConfig.bg;
    document.body.style.color = timeConfig.fg;
    document.body.setAttribute('data-theme', currentTimeOfDay);
  }, [timeConfig, currentTimeOfDay, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* 斑驳光影效果 - 带动画版本 */}
      {effectsEnabled && (
        <div id="dappled-light" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          {/* 主光晕 */}
          <div className="glow-layer" style={{
            position: 'absolute',
            width: '120%',
            height: '120%',
            top: '-20%',
            left: '-10%',
            background: `radial-gradient(ellipse 100% 60% at 70% 10%, ${timeConfig.glow}${Math.round(timeConfig.glowIntensity * 200).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
            willChange: 'transform, opacity',
          }} />

          {/* 次光晕 */}
          <div className="glow-layer" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bottom: 0,
            right: 0,
            background: `radial-gradient(ellipse 80% 50% at 90% 80%, ${timeConfig.glow}${Math.round(timeConfig.glowIntensity * 150).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
            animationDelay: '2s',
            willChange: 'transform, opacity',
          }} />

          {/* 光斑层 */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            opacity: timeConfig.leavesOpacity,
          }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const size = Math.random() * 200 + 80;
              const animationType = `spot-${(i % 3) + 1}` as const;
              return (
                <div
                  key={i}
                  className={animationType}
                  style={{
                    position: 'absolute',
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: `${Math.random() * 40 + 20}%`,
                    background: timeConfig.glow,
                    opacity: Math.random() * 0.25 + 0.1,
                    top: `${Math.random() * 70}%`,
                    right: `${Math.random() * 70 - 20}%`,
                    filter: 'blur(30px)',
                    mixBlendMode: 'overlay',
                    willChange: 'transform, opacity',
                  }}
                />
              );
            })}
          </div>

          {/* 固定大光斑 - 带动画 */}
          <div className="big-spot" style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: timeConfig.glow,
            opacity: 0.2,
            filter: 'blur(40px)',
            willChange: 'transform, opacity',
          }} />

          <div className="big-spot" style={{
            position: 'absolute',
            top: '30%',
            right: '30%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: timeConfig.glow,
            opacity: 0.15,
            filter: 'blur(35px)',
            animationDelay: '1s',
            willChange: 'transform, opacity',
          }} />

          <div className="big-spot" style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: timeConfig.glow,
            opacity: 0.18,
            filter: 'blur(45px)',
            animationDelay: '2s',
            willChange: 'transform, opacity',
          }} />

          {/* 百叶窗 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.4,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i % 2 === 0 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.03)',
                  margin: '3px 0',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 星空效果 */}
      {effectsEnabled && timeConfig.hasStars && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 200 }).map((_, i) => {
            const size = Math.random() * 3 + 1;
            return (
              <div
                key={i}
                className="star"
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  background: 'white',
                  borderRadius: '50%',
                  opacity: Math.random() * 0.8 + 0.2,
                  animationDelay: `${Math.random() * 3}s`,
                  willChange: 'transform, opacity',
                }}
              />
            );
          })}
        </div>
      )}

      {/* 萤火虫效果 */}
      {effectsEnabled && timeConfig.hasFireflies && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const floatType = i % 2 === 0 ? 'firefly-float-1' : 'firefly-float-2';
            return (
              <div
                key={i}
                className={`firefly ${floatType}`}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '6px',
                  height: '6px',
                  background: '#ffffaa',
                  borderRadius: '50%',
                  boxShadow: '0 0 15px 4px rgba(255, 255, 150, 0.8)',
                  animationDelay: `${Math.random() * 5}s`,
                  willChange: 'transform, opacity',
                }}
              />
            );
          })}
        </div>
      )}

      {/* 控制面板 */}
      <div style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'inherit',
      }}>
        <span style={{
          fontSize: '0.9rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}>
          {previewMode ? `预览: ${timeConfig.name}` : timeConfig.name}
        </span>

        {previewMode && (
          <button
            onClick={() => {
              setPreviewMode(false);
              setPreviewTimeOfDay(null);
            }}
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(239, 68, 68, 0.3)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '9999px',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            退出预览
          </button>
        )}

        <button
          onClick={() => setEffectsEnabled(!effectsEnabled)}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '9999px',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>{effectsEnabled ? 'Effects On' : 'Effects Off'}</span>
        </button>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '9999px',
            color: 'inherit',
            cursor: 'pointer',
          }}
          aria-label={audioEnabled ? '关闭音效' : '开启音效'}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: '1rem', height: '1rem' }}>
            {audioEnabled ? (
              <path
                d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <>
                <path
                  d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>
    </>
  );
}

export default NaturalLightWrapper;
