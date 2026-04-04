import { useNaturalLight } from '../context/ThemeContext';

/**
 * Theme toggle component
 */
export function ThemeToggle({ 
  showEffectsToggle = true, 
  showAudioToggle = true,
  className = '',
}: {
  showEffectsToggle?: boolean;
  showAudioToggle?: boolean;
  className?: string;
}) {
  const { 
    timeConfig, 
    effectsEnabled, 
    toggleEffects, 
    audioEnabled, 
    toggleAudio, 
    previewMode,
    exitPreview,
  } = useNaturalLight();

  return (
    <div className={`natural-light-controls ${className}`}>
      {/* Current period display */}
      <div className="natural-light-time-display">
        <span className="natural-light-period-text">
          {previewMode ? `预览: ${timeConfig.name}` : timeConfig.name}
        </span>
      </div>

      {/* Preview mode exit button */}
      {previewMode && (
        <button
          onClick={exitPreview}
          className="natural-light-exit-preview-btn"
          aria-label="Exit preview mode"
        >
          <svg viewBox="0 0 24 24" fill="none" className="natural-light-icon">
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M15 9l-6 6M9 9l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>退出预览</span>
        </button>
      )}

      {/* Effects toggle */}
      {showEffectsToggle && (
        <button
          onClick={toggleEffects}
          className={`natural-light-effects-toggle ${effectsEnabled ? 'active' : ''}`}
          aria-label={effectsEnabled ? 'Disable effects' : 'Enable effects'}
        >
          <span className="natural-light-toggle-label">
            {effectsEnabled ? 'Effects On' : 'Effects Off'}
          </span>
          
          <div className="natural-light-toggle-track">
            <div className={`natural-light-toggle-thumb ${effectsEnabled ? 'on' : 'off'}`}>
              <svg viewBox="0 0 24 24" fill="none" className="natural-light-icon">
                {effectsEnabled ? (
                  <>
                    <path
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </>
                ) : (
                  <path
                    d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Audio toggle */}
      {showAudioToggle && (
        <button
          onClick={toggleAudio}
          className={`natural-light-audio-toggle ${audioEnabled ? 'active' : ''}`}
          aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
        >
          {audioEnabled ? (
            <svg viewBox="0 0 24 24" fill="none" className="natural-light-icon">
              <path
                d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="natural-light-icon">
              <path
                d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Time card component
 */
export function TimeCard({ config, isActive, onClick }: {
  config: {
    name: string;
    nameEn: string;
    timeRange: string;
    bg: string;
    fg: string;
    hasStars?: boolean;
    hasFireflies?: boolean;
  };
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`natural-light-time-card ${isActive ? 'active' : ''}`}
      style={{ 
        backgroundColor: config.bg + (isActive ? 'cc' : '99'),
        color: config.fg,
      }}
    >
      <div className="natural-light-time-card-header">
        <span className="natural-light-time-card-name">{config.name}</span>
        {isActive && (
          <span className="natural-light-time-card-indicator" />
        )}
      </div>
      <div className="natural-light-time-card-en">{config.nameEn}</div>
      <div className="natural-light-time-card-range">{config.timeRange}</div>
      
      {/* Effect indicators */}
      <div className="natural-light-time-card-effects">
        {config.hasStars && (
          <span className="natural-light-effect-indicator" title="星空">✦</span>
        )}
        {config.hasFireflies && (
          <span className="natural-light-effect-indicator" title="萤火虫">✨</span>
        )}
      </div>
    </button>
  );
}

/**
 * Time selector component
 */
export function TimeSelector() {
  const { timeConfig, previewMode, setPreviewTimeOfDay, timeConfigs, mounted } = useNaturalLight();

  if (!mounted) return null;

  return (
    <div className="natural-light-time-selector">
      <h3 className="natural-light-time-selector-title">
        一天的时间流转
      </h3>
      <p className="natural-light-time-selector-hint">
        点击卡片预览不同时段的效果
      </p>
      <div className="natural-light-time-cards">
        {Object.entries(timeConfigs).map(([key, config]) => (
          <TimeCard 
            key={key} 
            config={config} 
            isActive={timeConfig.name === config.name}
            onClick={() => setPreviewTimeOfDay(key as any)}
          />
        ))}
      </div>
      
      <div className="natural-light-time-selector-note">
        <p>
          {previewMode 
            ? '预览模式：点击其他卡片切换时段，或点击右上角退出' 
            : '当前主题根据您本地时间自动确定'}
        </p>
      </div>
    </div>
  );
}
