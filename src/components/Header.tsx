'use client';

import { useTheme, TimeOfDay, TIME_CONFIGS } from '@/contexts/ThemeContext';

const TIME_ORDER: TimeOfDay[] = ['dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night'];

export function Header() {
  const { timeConfig, audioEnabled, toggleAudio, timeOfDay } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-current/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo 和网站名称 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {/* Logo 图标 */}
            <img
              src="/assets/bytedays.png" 
              alt="Logo"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xs opacity-60 font-mono">byte.day</span>
              <h1 className="text-lg font-medium">数字·白日梦</h1>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center gap-2">
          {/* 音效开关 - 滑动式 */}
          <button
            onClick={toggleAudio}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              audioEnabled
                ? 'bg-current/30'
                : 'bg-current/10'
            }`}
            title={audioEnabled ? '关闭音效' : '开启音效'}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 bg-gradient-to-br from-orange-400 to-amber-600 ${
                audioEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 时间轴时段指示器 */}
      <div className="text-center py-1">
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-current/10">
          {TIME_ORDER.map((timeKey) => {
            const config = TIME_CONFIGS[timeKey];
            const isActive = timeKey === timeOfDay;

            return (
              <div
                key={timeKey}
                className="flex-1 transition-all duration-500"
                style={{
                  backgroundColor: config.glow,
                  opacity: isActive ? 1 : 0.3,
                }}
                title={`${config.name} ${config.nameEn} · ${config.timeRange}`}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
}
