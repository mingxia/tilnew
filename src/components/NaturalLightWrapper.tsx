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

// 时段配置
const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  dawn: {
    name: '黎明',
    nameEn: 'Dawn',
    timeRange: '05:00 - 07:00',
    bg: '#2d1f3d',
    fg: '#f0e6d3',
    glow: '#ff9966',
    glowIntensity: 0.4,
    leavesOpacity: 0.2,
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
    glowIntensity: 0.6,
    leavesOpacity: 0.15,
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
    glowIntensity: 0.8,
    leavesOpacity: 0.12,
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
    glowIntensity: 0.7,
    leavesOpacity: 0.18,
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
    glowIntensity: 0.5,
    leavesOpacity: 0.25,
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
    glowIntensity: 0.2,
    leavesOpacity: 0.4,
    hasStars: true,
    hasFireflies: true,
  },
};

// 根据小时获取时段
function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

// 主组件
export function NaturalLightWrapper() {
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewTimeOfDay, setPreviewTimeOfDay] = useState<TimeOfDay | null>(null);

  const currentTimeOfDay = previewMode && previewTimeOfDay ? previewTimeOfDay : timeOfDay;
  const timeConfig = TIME_CONFIGS[currentTimeOfDay];

  // 初始化和定时更新
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setTimeOfDay(getTimeOfDay(hour));
    };

    setMounted(true);
    updateTime();
    const interval = setInterval(updateTime, 60000); // 每分钟更新一次
    return () => clearInterval(interval);
  }, []);

  // 应用主题到 body
  useEffect(() => {
    if (!mounted) return;
    document.body.style.backgroundColor = timeConfig.bg;
    document.body.style.color = timeConfig.fg;
    document.body.setAttribute('data-theme', currentTimeOfDay);
  }, [timeConfig, currentTimeOfDay, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* 斑驳光影效果 */}
      {effectsEnabled && (
        <div id="dappled-light" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'opacity 0.8s ease',
        }}>
          {/* SVG 风吹滤镜 */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence 
                  type="fractalNoise" 
                  baseFrequency="0.015" 
                  numOctaves="3" 
                  seed="1" 
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

          {/* 光晕效果 */}
          <div id="glow" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse 80% 50% at 70% 20%, ${timeConfig.glow}${Math.round(timeConfig.glowIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
            transition: 'background 1s cubic-bezier(0.455, 0.190, 0.000, 0.985)',
          }} />

          {/* 次要光晕 */}
          <div id="glow-bounce" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bottom: 0,
            background: `radial-gradient(ellipse 60% 40% at 60% 80%, ${timeConfig.glow}${Math.round(timeConfig.glowIntensity * 0.3 * 255).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
            transition: 'background 1s cubic-bezier(0.455, 0.190, 0.000, 0.985)',
          }} />

          {/* 透视容器和树叶 */}
          <div className="perspective" style={{
            position: 'absolute',
            top: '-30vh',
            right: 0,
            width: '80vw',
            height: '130vh',
            transformOrigin: 'top right',
            transformStyle: 'preserve-3d',
            transform: 'matrix3d(0.75, -0.0625, 0, 0.0008, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
            transition: 'transform 1.7s cubic-bezier(0.455, 0.190, 0.000, 0.985)',
          }}>
            <div id="leaves" style={{
              position: 'absolute',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              bottom: '-20px',
              right: '-700px',
              width: '1600px',
              height: '1400px',
              opacity: timeConfig.leavesOpacity,
              filter: 'url(#wind)',
              animation: 'billow 8s ease-in-out infinite',
              background: 'linear-gradient(135deg, rgba(74, 124, 89, 0.3) 0%, rgba(90, 140, 109, 0.2) 50%, rgba(58, 108, 77, 0.25) 100%)',
              borderRadius: '50%',
            }} />
          </div>
        </div>
      )}

      {/* 星空效果 */}
      {effectsEnabled && timeConfig.hasStars && (
        <div className="starfield" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                background: 'white',
                borderRadius: '50%',
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 萤火虫效果 */}
      {effectsEnabled && timeConfig.hasFireflies && (
        <div className="fireflies" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="firefly"
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '4px',
                height: '4px',
                background: '#ffffaa',
                borderRadius: '50%',
                boxShadow: '0 0 10px 2px rgba(255, 255, 150, 0.6)',
                animation: `float ${Math.random() * 3 + 6}s ease-in-out infinite, glow ${Math.random() * 2 + 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 控制面板 */}
      <div className="natural-light-controls" style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'inherit',
      }}>
        <span className="natural-light-period-text" style={{
          fontSize: '0.9rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}>
          {previewMode ? `预览: ${timeConfig.name}` : timeConfig.name}
        </span>

        {/* 退出预览按钮 */}
        {previewMode && (
          <button
            onClick={() => {
              setPreviewMode(false);
              setPreviewTimeOfDay(null);
            }}
            className="natural-light-exit-preview-btn"
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '9999px',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.3s ease',
            }}
          >
            <span>退出预览</span>
          </button>
        )}

        {/* 特效开关 */}
        <button
          onClick={() => setEffectsEnabled(!effectsEnabled)}
          className={`natural-light-effects-toggle ${effectsEnabled ? 'active' : ''}`}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '9999px',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
          }}
        >
          <span>{effectsEnabled ? 'Effects On' : 'Effects Off'}</span>
        </button>

        {/* 音效开关 */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`natural-light-audio-toggle ${audioEnabled ? 'active' : ''}`}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '9999px',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
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

      {/* CSS 动画定义 */}
      <style>{`
        @keyframes billow {
          0% { transform: perspective(400px) rotateX(0deg) rotateY(0deg) scale(1); }
          25% { transform: perspective(400px) rotateX(1deg) rotateY(2deg) scale(1.02); }
          50% { transform: perspective(400px) rotateX(-4deg) rotateY(-2deg) scale(0.97); }
          75% { transform: perspective(400px) rotateX(1deg) rotateY(-1deg) scale(1.04); }
          100% { transform: perspective(400px) rotateX(0deg) rotateY(0deg) scale(1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -30px); }
          50% { transform: translate(-10px, -50px); }
          75% { transform: translate(30px, -20px); }
        }

        @keyframes glow {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }

        .natural-light-effects-toggle:hover,
        .natural-light-audio-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .natural-light-exit-preview-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </>
  );
}

// 导出组件供 Astro 使用
export default NaturalLightWrapper;
