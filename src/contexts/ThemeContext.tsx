'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// 时间段类型
export type TimeOfDay = 
  | 'dawn'      // 黎明 5:00-7:00
  | 'morning'   // 上午 7:00-11:00
  | 'noon'      // 中午 11:00-14:00
  | 'afternoon' // 下午 14:00-17:00
  | 'dusk'      // 傍晚 17:00-20:00
  | 'night';    // 深夜 20:00-5:00

// 时间段配置
export interface TimeConfig {
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
  sounds: string[];
}

// 各时间段的配置
export const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
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
    sounds: ['dawn'],
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
    sounds: ['morning'],
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
    sounds: ['noon'],
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
    sounds: ['afternoon'],
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
    sounds: ['dusk'],
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
    sounds: ['night'],
  },
};

// 根据小时获取时间段
function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

interface ThemeContextType {
  timeOfDay: TimeOfDay;
  timeConfig: TimeConfig;
  audioEnabled: boolean;
  toggleAudio: () => void;
  mounted: boolean;
  currentTime: string;
  // 预览模式
  previewMode: boolean;
  previewTimeOfDay: TimeOfDay | null;
  setPreviewTimeOfDay: (time: TimeOfDay | null) => void;
  exitPreview: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [realTimeOfDay, setRealTimeOfDay] = useState<TimeOfDay>('noon');
  const [previewMode, setPreviewMode] = useState(false);
  const [previewTimeOfDay, setPreviewTimeOfDay] = useState<TimeOfDay | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // 实际显示的时间段（预览模式用预览值，否则用真实时间）
  const timeOfDay = previewMode && previewTimeOfDay ? previewTimeOfDay : realTimeOfDay;

  // 更新真实时间
  const updateTimeOfDay = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    setCurrentTime(timeStr);
    setRealTimeOfDay(getTimeOfDay(hour));
  }, []);

  // 初始化和定时更新
  useEffect(() => {
    updateTimeOfDay();
    setMounted(true);

    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, [updateTimeOfDay]);

  // 应用主题到 body
  useEffect(() => {
    if (!mounted) return;

    const config = TIME_CONFIGS[timeOfDay];
    document.body.style.backgroundColor = config.bg;
    document.body.style.color = config.fg;
    document.body.setAttribute('data-time', timeOfDay);
    document.body.setAttribute('data-preview', previewMode ? 'true' : 'false');
  }, [timeOfDay, mounted, previewMode]);

  // 设置预览时间
  const handleSetPreviewTimeOfDay = useCallback((time: TimeOfDay | null) => {
    if (time === null) {
      setPreviewMode(false);
      setPreviewTimeOfDay(null);
    } else {
      setPreviewMode(true);
      setPreviewTimeOfDay(time);
    }
  }, []);

  // 退出预览
  const exitPreview = useCallback(() => {
    setPreviewMode(false);
    setPreviewTimeOfDay(null);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  const timeConfig = TIME_CONFIGS[timeOfDay];

  return (
    <ThemeContext.Provider value={{
      timeOfDay,
      timeConfig,
      audioEnabled,
      toggleAudio,
      mounted,
      currentTime,
      previewMode,
      previewTimeOfDay,
      setPreviewTimeOfDay: handleSetPreviewTimeOfDay,
      exitPreview,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
