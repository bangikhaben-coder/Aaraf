import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Settings, CheckCircle2 } from 'lucide-react';
import { PomodoroPhase, PomodoroSettings } from '../types';
import { soundService } from '../services/sound';
import { useLanguage } from '../i18n/LanguageContext';

export const FocusView: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem('chronos_pomodoro_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      cyclesBeforeLongBreak: 4,
      autoStartBreaks: true,
      autoStartFocus: false,
    };
  });

  const [currentPhase, setCurrentPhase] = useState<PomodoroPhase>('focus');
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const getDurationForPhase = (phase: PomodoroPhase): number => {
    switch (phase) {
      case 'focus':
        return settings.focusDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    settings.focusDuration * 60
  );

  useEffect(() => {
    localStorage.setItem('chronos_pomodoro_settings', JSON.stringify(settings));
  }, [settings]);

  // Tick timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) return;

      setRemainingSeconds(prev => {
        if (prev <= 1) {
          // Transition phase!
          soundService.playTone('gong');

          if (currentPhase === 'focus') {
            const newCount = completedCycles + 1;
            setCompletedCycles(newCount);
            if (newCount % settings.cyclesBeforeLongBreak === 0) {
              setCurrentPhase('longBreak');
              setIsRunning(settings.autoStartBreaks);
              return settings.longBreakDuration * 60;
            } else {
              setCurrentPhase('shortBreak');
              setIsRunning(settings.autoStartBreaks);
              return settings.shortBreakDuration * 60;
            }
          } else {
            // Break finished, go to focus
            setCurrentPhase('focus');
            setIsRunning(settings.autoStartFocus);
            return settings.focusDuration * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentPhase, completedCycles, settings]);

  const switchPhaseManually = (phase: PomodoroPhase) => {
    setCurrentPhase(phase);
    setIsRunning(false);
    setRemainingSeconds(getDurationForPhase(phase));
  };

  const skipCurrentPhase = () => {
    if (currentPhase === 'focus') {
      const newCount = completedCycles + 1;
      setCompletedCycles(newCount);
      if (newCount % settings.cyclesBeforeLongBreak === 0) {
        setCurrentPhase('longBreak');
        setRemainingSeconds(settings.longBreakDuration * 60);
      } else {
        setCurrentPhase('shortBreak');
        setRemainingSeconds(settings.shortBreakDuration * 60);
      }
    } else {
      setCurrentPhase('focus');
      setRemainingSeconds(settings.focusDuration * 60);
    }
    setIsRunning(false);
  };

  const resetCurrentSession = () => {
    setIsRunning(false);
    setRemainingSeconds(getDurationForPhase(currentPhase));
  };

  const totalCurrentDuration = getDurationForPhase(currentPhase);
  const progressRatio = totalCurrentDuration > 0
    ? (remainingSeconds / totalCurrentDuration)
    : 0;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const phaseTitle = {
    focus: t('deepFocus'),
    shortBreak: t('shortBreak'),
    longBreak: t('longBreak'),
  }[currentPhase];

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Top Header & Settings trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('intervalFlow')}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">{t('intervalDesc')}</p>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t('config')}</span>
        </button>
      </div>

      {/* Main Focus Dial Card */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 sm:p-12 text-center">
        {/* Phase selector tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => switchPhaseManually('focus')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              currentPhase === 'focus'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white bg-neutral-800/60'
            }`}
          >
            {t('deepFocus')} ({settings.focusDuration}m)
          </button>
          <button
            onClick={() => switchPhaseManually('shortBreak')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              currentPhase === 'shortBreak'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white bg-neutral-800/60'
            }`}
          >
            {t('shortBreak')} ({settings.shortBreakDuration}m)
          </button>
          <button
            onClick={() => switchPhaseManually('longBreak')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              currentPhase === 'longBreak'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white bg-neutral-800/60'
            }`}
          >
            {t('longBreak')} ({settings.longBreakDuration}m)
          </button>
        </div>

        {/* Circular Countdown Ring */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 220 220">
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke={currentPhase === 'focus' ? '#ffffff' : '#38bdf8'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
              />
            </svg>

            {/* In-ring text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono-time text-5xl sm:text-6xl font-bold text-white tracking-tight tabular-nums">
                {formatTime(remainingSeconds)}
              </span>
              <p className="text-xs font-medium text-neutral-400 mt-2">
                {phaseTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer ${
              isRunning
                ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                : 'bg-white text-neutral-950 hover:bg-neutral-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{t('pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t('start')}</span>
              </>
            )}
          </button>

          <button
            onClick={skipCurrentPhase}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors cursor-pointer"
            title="Skip to next phase"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">{t('skip')}</span>
          </button>

          <button
            onClick={resetCurrentSession}
            className="p-3 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-colors cursor-pointer"
            title={t('reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Cycles completion stats */}
        <div className="mt-10 pt-6 border-t border-neutral-800/80 flex items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('completedFocusBlocks')}: <strong className="text-white">{completedCycles}</strong></span>
          </div>
          <span aria-hidden="true">·</span>
          <span>Cycle: {(completedCycles % settings.cyclesBeforeLongBreak) + 1} {t('cycleOf')} {settings.cyclesBeforeLongBreak}</span>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">{t('focusConfig')}</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {t('close')}
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">{t('focusDuration')}</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusDuration}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 25);
                    setSettings(s => ({ ...s, focusDuration: val }));
                    if (currentPhase === 'focus' && !isRunning) {
                      setRemainingSeconds(val * 60);
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t('shortBreakDuration')}</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.shortBreakDuration}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 5);
                    setSettings(s => ({ ...s, shortBreakDuration: val }));
                    if (currentPhase === 'shortBreak' && !isRunning) {
                      setRemainingSeconds(val * 60);
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t('longBreakDuration')}</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.longBreakDuration}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 15);
                    setSettings(s => ({ ...s, longBreakDuration: val }));
                    if (currentPhase === 'longBreak' && !isRunning) {
                      setRemainingSeconds(val * 60);
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t('cyclesBeforeLong')}</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={settings.cyclesBeforeLongBreak}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 4);
                    setSettings(s => ({ ...s, cyclesBeforeLongBreak: val }));
                  }}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-sm text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-neutral-300">{t('autoStartBreaks')}</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={e => setSettings(s => ({ ...s, autoStartBreaks: e.target.checked }))}
                  className="rounded border-neutral-700"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-300">{t('autoStartFocus')}</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartFocus}
                  onChange={e => setSettings(s => ({ ...s, autoStartFocus: e.target.checked }))}
                  className="rounded border-neutral-700"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2 rounded-xl text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {t('save')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
