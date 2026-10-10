import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Minimize2, Palette } from 'lucide-react';
import { ZenTheme } from '../types';
import { soundService } from '../services/sound';
import { useLanguage } from '../i18n/LanguageContext';

interface ZenClockModalProps {
  onClose: () => void;
}

export const ZenClockModal: React.FC<ZenClockModalProps> = ({ onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [now, setNow] = useState<Date>(new Date());
  const [theme, setTheme] = useState<ZenTheme>('minimal');
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [isTicking, setIsTicking] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setNow(current);
      if (isTicking) {
        soundService.playTick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTicking]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const formattedDate = now.toLocaleDateString(currentLanguage || 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const themeStyles = {
    minimal: {
      bg: 'bg-black text-neutral-100',
      timeColor: 'text-white',
      secColor: 'text-neutral-500',
      dateColor: 'text-neutral-400',
    },
    amber: {
      bg: 'bg-stone-950 text-amber-200',
      timeColor: 'text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]',
      secColor: 'text-amber-600',
      dateColor: 'text-amber-500/80',
    },
    emerald: {
      bg: 'bg-neutral-950 text-emerald-300',
      timeColor: 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.3)]',
      secColor: 'text-emerald-700',
      dateColor: 'text-emerald-600',
    },
    indigo: {
      bg: 'bg-slate-950 text-indigo-200',
      timeColor: 'text-indigo-200 drop-shadow-[0_0_30px_rgba(129,140,248,0.25)]',
      secColor: 'text-indigo-500',
      dateColor: 'text-indigo-400/80',
    },
    sand: {
      bg: 'bg-[#181614] text-stone-200',
      timeColor: 'text-[#e6ded5]',
      secColor: 'text-stone-500',
      dateColor: 'text-stone-400',
    },
  }[theme];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between p-8 sm:p-14 select-none ${themeStyles.bg} transition-colors duration-500`}>
      {/* Top Floating Controls */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/40 backdrop-blur-md border border-white/5">
            <Palette className="w-3.5 h-3.5 text-neutral-400 ml-1.5" />
            {(['minimal', 'amber', 'emerald', 'indigo', 'sand'] as ZenTheme[]).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                  theme === t ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Toggle seconds */}
          <button
            onClick={() => setShowSeconds(!showSeconds)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900/40 backdrop-blur-md border border-white/5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            {showSeconds ? 'Hide Sec' : 'Show Sec'}
          </button>

          {/* Optional soft tick sound */}
          <button
            onClick={() => setIsTicking(!isTicking)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/40 backdrop-blur-md border border-white/5 text-xs transition-colors ${
              isTicking ? 'text-amber-300' : 'text-neutral-400 hover:text-white'
            }`}
            title="Tick sound"
          >
            {isTicking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Tick</span>
          </button>
        </div>

        {/* Exit fullscreen button */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900/40 backdrop-blur-md border border-white/10 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>{t('exitAmbient')}</span>
          <kbd className="text-[10px] bg-white/10 px-1 py-0.5 rounded text-neutral-400 ml-1">Esc</kbd>
        </button>
      </div>

      {/* Main Massive Clock */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="flex items-baseline justify-center font-mono-time tracking-tighter">
          <span className={`text-[18vw] font-bold leading-none tabular-nums ${themeStyles.timeColor}`}>
            {hours}:{minutes}
          </span>
          {showSeconds && (
            <span className={`text-[8vw] font-light leading-none tabular-nums ml-2 ${themeStyles.secColor}`}>
              :{seconds}
            </span>
          )}
        </div>

        <p className={`mt-6 text-xl sm:text-2xl md:text-3xl font-medium tracking-wide ${themeStyles.dateColor}`}>
          {formattedDate}
        </p>
      </div>

      {/* Bottom Quiet Footer */}
      <div className="flex items-center justify-center text-xs text-neutral-600 z-10">
        <span>Chronos Ambient Clock</span>
        <span className="mx-2">·</span>
        <span>Press Esc to exit</span>
      </div>
    </div>
  );
};
