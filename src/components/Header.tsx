import React from 'react';
import { Maximize2, Volume2, VolumeX, Globe } from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenZen: () => void;
  onOpenLanguage: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenZen,
  onOpenLanguage,
  isMuted,
  onToggleMute,
}) => {
  const { t, currentLanguage } = useLanguage();

  return (
    <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
          Chronos
        </span>
      </div>

      {/* Zone 2: 4 concise single-line navigation links */}
      <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium">
        <button
          onClick={() => onTabChange('clock')}
          className={`cursor-pointer whitespace-nowrap transition-colors pb-1 border-b-2 ${
            activeTab === 'clock'
              ? 'text-white border-white'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          {t('navClock')}
        </button>
        <button
          onClick={() => onTabChange('timer')}
          className={`cursor-pointer whitespace-nowrap transition-colors pb-1 border-b-2 ${
            activeTab === 'timer'
              ? 'text-white border-white'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          {t('navTimers')}
        </button>
        <button
          onClick={() => onTabChange('stopwatch')}
          className={`cursor-pointer whitespace-nowrap transition-colors pb-1 border-b-2 ${
            activeTab === 'stopwatch'
              ? 'text-white border-white'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          {t('navStopwatch')}
        </button>
        <button
          onClick={() => onTabChange('focus')}
          className={`cursor-pointer whitespace-nowrap transition-colors pb-1 border-b-2 ${
            activeTab === 'focus'
              ? 'text-white border-white'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          {t('navFocus')}
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language button */}
        <button
          onClick={onOpenLanguage}
          title={t('language')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-900 border border-neutral-800 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold uppercase text-[11px]">{currentLanguage}</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? t('unmute') : t('mute')}
          className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-900 border border-neutral-800 cursor-pointer"
          aria-label={isMuted ? t('unmute') : t('mute')}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenZen}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors rounded-lg whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{t('ambientMode')}</span>
        </button>
      </div>
    </header>
  );
};

