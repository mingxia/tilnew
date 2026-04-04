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

// 时段配置 - 增加了 leavesOpacity 值
const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  dawn: {
    name: '黎明',
    nameEn: 'Dawn',
    timeRange: '05:00 - 07:00',
    bg: '#2d1f3d',
    fg: '#f0e6d3',
    glow: '#ff9966',
    glowIntensity: 0.4,
    leavesOpacity: 0.4,  // 增强可见度
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
    leavesOpacity: 0.35,  // 增强可见度
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
    leavesOpacity: 0.3,  // 增强可见度
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
    leavesOpacity: 0.35,  // 增强可见度
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
    leavesOpacity: 0.4,  // 增强可见度
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
    leavesOpacity: 0.5,  // 增强可见度
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
      {/* 斑驳光影效果 - 增强版 */}
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

          {/* 树叶容器 - 使用多个圆形模拟树叶 */}
          <div className="leaves-container" style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            opacity: timeConfig.leavesOpacity,
            transition: 'opacity 0.8s ease',
          }}>
            {/* 生成多个光斑模拟树叶透光 */}
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="light-spot"
                style={{
                  position: 'absolute',
                  width: `${Math.random() * 150 + 50}px`,
                  height: `${Math.random() * 150 + 50}px`,
                  borderRadius: `${Math.random() * 30 + 20}%`,
                  background: timeConfig.glow,
                  opacity: Math.random() * 0.15 + 0.05,
                  top: `${Math.random() * 80}%`,
                  right: `${Math.random() * 60}%`,
                  animation: `float-spot ${Math.random() * 5 + 5}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  filter: 'blur(20px)',
                }}
              />
            ))}
          </div>

          {/* 百叶窗效果 */}
          <div className="blinds" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            opacity: 0.3,
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="blind-slat"
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  margin: '4px 0',
                  borderRadius: '2px',
                  backdropFilter: 'blur(2px)',
                }}
              />
            ))}
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

        {previewMode && (
          <button
            onClick={() => {
              setPreviewMode(false);
              setPreviewTimeOfDay(null);
            }}
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

        <button
          onClick={() => setEffectsEnabled(!effectsEnabled)}
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

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
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

      {/* CSS 动画 */}
      <style>{`
        @keyframes float-spot {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.1);
            opacity: 0.15;
          }
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

        .light-spot {
          transition: all 0.5s ease;
        }

        .blind-slat {
          animation: blind-pulse 3s ease-in-out infinite;
        }

        @keyframes blind-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}

export default NaturalLightWrapper;
