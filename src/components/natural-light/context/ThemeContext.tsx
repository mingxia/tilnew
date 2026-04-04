'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Types
type TimeOfDay = 
  | 'dawn'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'dusk'
  | 'night';

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
  sounds: string[];
}

interface ThemeContextValue {
  timeOfDay: TimeOfDay;
  timeConfig: TimeConfig;
  effectsEnabled: boolean;
  toggleEffects: () => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  mounted: boolean;
  previewMode: boolean;
  setPreviewTimeOfDay: (time: TimeOfDay | null) => void;
  exitPreview: () => void;
  timeConfigs: Record<TimeOfDay, TimeConfig>;
}

// Default time configurations
const DEFAULT_TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
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
    sounds: ['birds'],
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
    sounds: ['birds', 'wind'],
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
    sounds: ['wind', 'leaves'],
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
    sounds: ['wind', 'leaves'],
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
    sounds: ['wind'],
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
    sounds: ['crickets', 'owl'],
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

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useNaturalLight(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useNaturalLight must be used within a NaturalLightProvider');
  }
  return context;
}

interface NaturalLightProviderProps {
  children: React.ReactNode;
  customConfigs?: Partial<Record<TimeOfDay, Partial<TimeConfig>>>;
  defaultEffectsEnabled?: boolean;
  defaultAudioEnabled?: boolean;
}

export function NaturalLightProvider({ 
  children, 
  customConfigs,
  defaultEffectsEnabled = true,
  defaultAudioEnabled = false,
}: NaturalLightProviderProps) {
  const timeConfigs: Record<TimeOfDay, TimeConfig> = {
    dawn: { ...DEFAULT_TIME_CONFIGS.dawn, ...customConfigs?.dawn },
    morning: { ...DEFAULT_TIME_CONFIGS.morning, ...customConfigs?.morning },
    noon: { ...DEFAULT_TIME_CONFIGS.noon, ...customConfigs?.noon },
    afternoon: { ...DEFAULT_TIME_CONFIGS.afternoon, ...customConfigs?.afternoon },
    dusk: { ...DEFAULT_TIME_CONFIGS.dusk, ...customConfigs?.dusk },
    night: { ...DEFAULT_TIME_CONFIGS.night, ...customConfigs?.night },
  };

  const [realTimeOfDay, setRealTimeOfDay] = useState<TimeOfDay>('noon');
  const [previewMode, setPreviewMode] = useState(false);
  const [previewTimeOfDay, setPreviewTimeOfDay] = useState<TimeOfDay | null>(null);
  const [effectsEnabled, setEffectsEnabled] = useState(defaultEffectsEnabled);
  const [audioEnabled, setAudioEnabled] = useState(defaultAudioEnabled);
  const [mounted, setMounted] = useState(false);

  const timeOfDay = previewMode && previewTimeOfDay ? previewTimeOfDay : realTimeOfDay;
  const timeConfig = timeConfigs[timeOfDay];

  const updateTimeOfDay = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    setRealTimeOfDay(getTimeOfDay(hour));
  }, []);

  useEffect(() => {
    updateTimeOfDay();
    setMounted(true);
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, [updateTimeOfDay]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.backgroundColor = timeConfig.bg;
    document.body.style.color = timeConfig.fg;
    document.body.setAttribute('data-theme', timeOfDay);
    document.body.setAttribute('data-effects', effectsEnabled ? 'on' : 'off');
  }, [timeConfig, timeOfDay, effectsEnabled, mounted]);

  const toggleEffects = useCallback(() => {
    setEffectsEnabled((prev) => !prev);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev);
  }, []);

  const handleSetPreviewTimeOfDay = useCallback((time: TimeOfDay | null) => {
    if (time) {
      setPreviewMode(true);
      setPreviewTimeOfDay(time);
    } else {
      setPreviewMode(false);
      setPreviewTimeOfDay(null);
    }
  }, []);

  const exitPreview = useCallback(() => {
    setPreviewMode(false);
    setPreviewTimeOfDay(null);
  }, []);

  const value: ThemeContextValue = {
    timeOfDay,
    timeConfig,
    effectsEnabled,
    toggleEffects,
    audioEnabled,
    toggleAudio,
    mounted,
    previewMode,
    setPreviewTimeOfDay: handleSetPreviewTimeOfDay,
    exitPreview,
    timeConfigs,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export { DEFAULT_TIME_CONFIGS };
