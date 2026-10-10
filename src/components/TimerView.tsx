import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Volume2, VolumeX, Repeat, CheckCircle, Zap, ChevronDown, Check, Music } from 'lucide-react';
import { ActiveTimer, SoundTone, SOUND_OPTIONS } from '../types';
import { soundService } from '../services/sound';
import { useLanguage } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

interface QuickPreset {
  label: string;
  shortLabel: string;
  taglineKey: TranslationKey;
  defaultTagline: string;
  seconds: number;
  featured?: boolean;
}

const FEATURED_PRESETS: QuickPreset[] = [
  { label: '5 Minutes', shortLabel: '5m', taglineKey: 'breakAndTea', defaultTagline: 'Break & Tea', seconds: 300, featured: true },
  { label: '15 Minutes', shortLabel: '15m', taglineKey: 'focusedSprint', defaultTagline: 'Focused Sprint', seconds: 900, featured: true },
  { label: '30 Minutes', shortLabel: '30m', taglineKey: 'deepWork', defaultTagline: 'Deep Work Block', seconds: 1800, featured: true },
  { label: '60 Minutes', shortLabel: '60m', taglineKey: 'fullHour', defaultTagline: 'Full Hour Session', seconds: 3600, featured: true },
];

const SECONDARY_PRESETS: QuickPreset[] = [
  { label: '1 min', shortLabel: '1m', taglineKey: 'express', defaultTagline: 'Express', seconds: 60 },
  { label: '3 min', shortLabel: '3m', taglineKey: 'steep', defaultTagline: 'Steep', seconds: 180 },
  { label: '10 min', shortLabel: '10m', taglineKey: 'shortTask', defaultTagline: 'Short Task', seconds: 600 },
  { label: '20 min', shortLabel: '20m', taglineKey: 'powerNap', defaultTagline: 'Power Nap', seconds: 1200 },
  { label: '25 min', shortLabel: '25m', taglineKey: 'pomodoroFocus', defaultTagline: 'Pomodoro Focus', seconds: 1500 },
  { label: '45 min', shortLabel: '45m', taglineKey: 'studySession', defaultTagline: 'Lecture / Study', seconds: 2700 },
];

export const TimerView: React.FC = () => {
  const { t } = useLanguage();
  const [autoStartQuickTimer, setAutoStartQuickTimer] = useState<boolean>(true);
  const [lastLaunchedLabel, setLastLaunchedLabel] = useState<string | null>(null);

  // Default alarm sound for new timers
  const [defaultSound, setDefaultSound] = useState<SoundTone>(() => {
    const saved = localStorage.getItem('chronos_default_alarm_sound');
    if (saved && ['bell', 'digital', 'analog', 'gong', 'woodblock', 'ping'].includes(saved)) {
      return saved as SoundTone;
    }
    return 'bell';
  });

  const [showSoundMenu, setShowSoundMenu] = useState<boolean>(false);
  const [activeTimerSoundMenuId, setActiveTimerSoundMenuId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(soundService.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(soundService.getIsMuted());

  const [timers, setTimers] = useState<ActiveTimer[]>(() => {
    const saved = localStorage.getItem('chronos_active_timers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // pause active ones on page load for safety
        return parsed.map((t: ActiveTimer) => ({ ...t, isRunning: false }));
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'default_timer_1',
        label: 'Focus Session',
        totalSeconds: 1500,
        remainingSeconds: 1500,
        isRunning: false,
        isCompleted: false,
        soundType: 'bell',
        repeat: false,
        createdAt: Date.now(),
      },
    ];
  });

  // Creator state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string>('Custom Timer');
  const [hoursInput, setHoursInput] = useState<number>(0);
  const [minsInput, setMinsInput] = useState<number>(10);
  const [secsInput, setSecsInput] = useState<number>(0);
  const [selectedSound, setSelectedSound] = useState<SoundTone>(defaultSound);
  const [repeatToggle, setRepeatToggle] = useState<boolean>(false);


  // Synchronous tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers =>
        prevTimers.map(timer => {
          if (!timer.isRunning) return timer;

          if (timer.remainingSeconds <= 1) {
            // Alarm fires!
            soundService.playTone(timer.soundType);

            if (timer.repeat) {
              return {
                ...timer,
                remainingSeconds: timer.totalSeconds,
                isRunning: true,
                isCompleted: false,
              };
            }

            return {
              ...timer,
              remainingSeconds: 0,
              isRunning: false,
              isCompleted: true,
            };
          }

          return {
            ...timer,
            remainingSeconds: timer.remainingSeconds - 1,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chronos_active_timers', JSON.stringify(timers));
  }, [timers]);

  const toggleTimerRunning = (id: string) => {
    setTimers(prev =>
      prev.map(t => {
        if (t.id === id) {
          // If already completed and user clicks play, restart it
          if (t.isCompleted || t.remainingSeconds === 0) {
            return {
              ...t,
              remainingSeconds: t.totalSeconds,
              isRunning: true,
              isCompleted: false,
            };
          }
          return { ...t, isRunning: !t.isRunning };
        }
        return t;
      })
    );
  };

  const resetTimer = (id: string) => {
    setTimers(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              remainingSeconds: t.totalSeconds,
              isRunning: false,
              isCompleted: false,
            }
          : t
      )
    );
  };

  const addTime = (id: string, additionalSeconds: number) => {
    setTimers(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newRemaining = t.remainingSeconds + additionalSeconds;
          return {
            ...t,
            remainingSeconds: newRemaining,
            totalSeconds: Math.max(t.totalSeconds, newRemaining),
            isCompleted: false,
          };
        }
        return t;
      })
    );
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const handleQuickTimerLaunch = (preset: QuickPreset) => {
    const newTimer: ActiveTimer = {
      id: `timer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: preset.label,
      totalSeconds: preset.seconds,
      remainingSeconds: preset.seconds,
      isRunning: autoStartQuickTimer,
      isCompleted: false,
      soundType: defaultSound,
      repeat: false,
      createdAt: Date.now(),
    };

    setTimers(prev => [newTimer, ...prev]);
    setLastLaunchedLabel(`${preset.shortLabel} (${autoStartQuickTimer ? 'Started' : 'Added'})`);
    soundService.playTick();

    setTimeout(() => {
      setLastLaunchedLabel(null);
    }, 2500);
  };

  const handleSelectDefaultSound = (tone: SoundTone, applyToAll = false) => {
    setDefaultSound(tone);
    setSelectedSound(tone);
    localStorage.setItem('chronos_default_alarm_sound', tone);
    soundService.playTone(tone);

    if (applyToAll) {
      setTimers(prev => prev.map(t => ({ ...t, soundType: tone })));
    }
  };

  const handleUpdateTimerSound = (timerId: string, tone: SoundTone) => {
    setTimers(prev => prev.map(t => (t.id === timerId ? { ...t, soundType: tone } : t)));
    soundService.playTone(tone);
    setActiveTimerSoundMenuId(null);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundService.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      soundService.setIsMuted(false);
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const currentDefaultSoundOption = SOUND_OPTIONS.find(s => s.id === defaultSound) || SOUND_OPTIONS[0];

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecs = (hoursInput * 3600) + (minsInput * 60) + secsInput;
    if (totalSecs <= 0) return;

    const newTimer: ActiveTimer = {
      id: `timer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: newLabel.trim() || 'Timer',
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      isRunning: autoStartQuickTimer,
      isCompleted: false,
      soundType: selectedSound,
      repeat: repeatToggle,
      createdAt: Date.now(),
    };

    setTimers(prev => [newTimer, ...prev]);
    setShowCreateModal(false);
  };

  const formatSeconds = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  return (
    <div className="space-y-10">
      {/* Quick Timer Presets Section */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700/60 text-white">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">{t('quickTimers')}</h2>
                {lastLaunchedLabel && (
                  <span className="text-xs text-amber-400 font-medium transition-opacity animate-fade-in">
                    · Set {lastLaunchedLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t('quickTimerDesc')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sound Selection Menu Trigger Button */}
            <button
              onClick={() => setShowSoundMenu(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors rounded-lg shadow-xs cursor-pointer"
              title={t('alarmSound')}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('alarmSound')}: <strong>{currentDefaultSoundOption.name}</strong></span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Auto-start toggle */}
            <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none bg-neutral-900/60 border border-neutral-800/80 px-2.5 py-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={autoStartQuickTimer}
                onChange={e => setAutoStartQuickTimer(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-950 text-white focus:ring-0 cursor-pointer"
              />
              <span>{t('autoStart')}</span>
            </label>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('customTimer')}</span>
            </button>
          </div>
        </div>

        {/* Featured Primary 1-Click Cards: 5m, 15m, 30m, 60m */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {FEATURED_PRESETS.map(preset => (
            <button
              key={preset.shortLabel}
              onClick={() => handleQuickTimerLaunch(preset)}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-600 hover:bg-neutral-900/90 transition-all text-left cursor-pointer active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 group-hover:text-neutral-300">
                    {t(preset.taglineKey, preset.defaultTagline)}
                  </span>
                  <div className="p-1 rounded-md bg-neutral-900 group-hover:bg-neutral-800 text-neutral-400 group-hover:text-white transition-colors">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>

                <div className="mt-2">
                  <span className="font-mono-time text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {preset.shortLabel}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-900 group-hover:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-mono-time">{formatSeconds(preset.seconds)}</span>
                <span className="font-medium text-neutral-300 group-hover:text-white">
                  {t('oneClickStart')}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Secondary Quick Presets Chips */}
        <div className="pt-2 border-t border-neutral-800/60">
          <p className="text-xs text-neutral-500 mb-2.5">More Instant Durations</p>
          <div className="flex flex-wrap gap-2">
            {SECONDARY_PRESETS.map(preset => (
              <button
                key={preset.shortLabel}
                onClick={() => handleQuickTimerLaunch(preset)}
                className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white rounded-lg transition-colors cursor-pointer active:scale-95"
              >
                <span className="font-mono-time font-semibold text-white">{preset.shortLabel}</span>
                <span className="text-neutral-500 group-hover:text-neutral-400">· {preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Timers Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{t('activeTimers')} ({timers.length})</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Live countdown monitors and controls</p>
          </div>

          {timers.length > 0 && (
            <button
              onClick={() => setTimers([])}
              className="text-xs text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              {t('clearAllTimers')}
            </button>
          )}
        </div>
      </section>

      {/* Timers Grid */}
      {timers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-400">{t('noActiveTimers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timers.map(timer => {
            const progress = timer.totalSeconds > 0
              ? (timer.remainingSeconds / timer.totalSeconds)
              : 0;

            const radius = 64;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference * (1 - progress);

            return (
              <div
                key={timer.id}
                className={`relative rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                  timer.isCompleted
                    ? 'border-amber-500/80 bg-amber-950/20 shadow-lg shadow-amber-950/30'
                    : timer.isRunning
                    ? 'border-neutral-700 bg-neutral-900/80 shadow-md'
                    : 'border-neutral-800 bg-neutral-900/50'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="pr-2">
                    <h3 className="text-base font-semibold text-white truncate max-w-[180px]">
                      {timer.label}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{t('total')} {formatSeconds(timer.totalSeconds)}</span>
                      {timer.repeat && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-neutral-300">
                            <Repeat className="w-3 h-3" /> {t('loop')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTimer(timer.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
                    title="Delete timer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Dial & Remaining Display */}
                <div className="my-6 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                      {/* Background track */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        className="stroke-neutral-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Active progress */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={timer.isCompleted ? '#f59e0b' : '#ffffff'}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-300"
                      />
                    </svg>

                    {/* Inside timer info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono-time text-3xl font-bold text-white tracking-tight">
                        {formatSeconds(timer.remainingSeconds)}
                      </span>
                      {timer.isCompleted ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 mt-1 animate-pulse">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('finished')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 mt-1">
                          {Math.round(progress * 100)}% {t('left')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                  {/* Extension & Sound Buttons */}
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => addTime(timer.id, 60)}
                        className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                        title="Add 1 minute"
                      >
                        +1m
                      </button>
                      <button
                        onClick={() => addTime(timer.id, 300)}
                        className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                        title="Add 5 minutes"
                      >
                        +5m
                      </button>
                    </div>

                    {/* Per-timer sound menu trigger */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveTimerSoundMenuId(
                            activeTimerSoundMenuId === timer.id ? null : timer.id
                          )
                        }
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700/60 rounded-md transition-colors"
                        title="Change alarm sound for this timer"
                      >
                        <Music className="w-3 h-3 text-amber-400" />
                        <span className="truncate max-w-[85px]">
                          {SOUND_OPTIONS.find(s => s.id === timer.soundType)?.name || 'Sound'}
                        </span>
                        <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
                      </button>

                      {/* Dropdown menu */}
                      {activeTimerSoundMenuId === timer.id && (
                        <div className="absolute bottom-full right-0 mb-2 z-40 w-48 rounded-xl border border-neutral-700 bg-neutral-900 p-1.5 shadow-2xl">
                          <div className="flex items-center justify-between px-2 py-1 border-b border-neutral-800 mb-1">
                            <span className="text-[10px] font-semibold text-neutral-400">Alarm Tone</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                soundService.playTone(timer.soundType);
                              }}
                              className="text-[10px] text-amber-400 hover:text-amber-300"
                            >
                              Test
                            </button>
                          </div>
                          <div className="space-y-0.5 max-h-48 overflow-y-auto">
                            {SOUND_OPTIONS.map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => handleUpdateTimerSound(timer.id, opt.id)}
                                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                                  timer.soundType === opt.id
                                    ? 'bg-neutral-800 text-white font-medium'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                }`}
                              >
                                <span>{opt.name}</span>
                                {timer.soundType === opt.id && (
                                  <Check className="w-3 h-3 text-amber-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTimerRunning(timer.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        timer.isRunning
                          ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                          : 'bg-white text-neutral-950 hover:bg-neutral-200 shadow-sm'
                      }`}
                    >
                      {timer.isRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>{t('pause')}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{timer.isCompleted ? t('restart') : t('start')}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => resetTimer(timer.id)}
                      className="p-2 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Custom Timer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCustom}
            className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">{t('createCustomTimer')}</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {t('cancel')}
              </button>
            </div>

            {/* Timer Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {t('timerLabel')}
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="e.g. Pasta, Tea, Deep Work"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
              />
            </div>

            {/* Duration Input Pickers */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {t('duration')} ({t('hours')} : {t('minutes')} : {t('seconds')})
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={hoursInput}
                    onChange={e => setHoursInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center font-mono-time text-lg font-semibold rounded-lg border border-neutral-800 bg-neutral-950 py-2 text-white focus:border-neutral-700 focus:outline-none"
                  />
                  <span className="block text-center text-xs text-neutral-500 mt-1">{t('hours')}</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minsInput}
                    onChange={e => setMinsInput(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full text-center font-mono-time text-lg font-semibold rounded-lg border border-neutral-800 bg-neutral-950 py-2 text-white focus:border-neutral-700 focus:outline-none"
                  />
                  <span className="block text-center text-xs text-neutral-500 mt-1">{t('minutes')}</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={secsInput}
                    onChange={e => setSecsInput(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full text-center font-mono-time text-lg font-semibold rounded-lg border border-neutral-800 bg-neutral-950 py-2 text-white focus:border-neutral-700 focus:outline-none"
                  />
                  <span className="block text-center text-xs text-neutral-500 mt-1">{t('seconds')}</span>
                </div>
              </div>
            </div>

            {/* Sound Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {t('alarmSound')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SOUND_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => {
                      setSelectedSound(opt.id);
                      soundService.playTone(opt.id);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSound === opt.id
                        ? 'border-neutral-500 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium">{opt.name}</p>
                    </div>
                    {selectedSound === opt.id ? (
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat loop option */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-300">{t('loop')}</span>
              <button
                type="button"
                onClick={() => setRepeatToggle(!repeatToggle)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  repeatToggle ? 'bg-white' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out ${
                    repeatToggle ? 'translate-x-4 bg-neutral-950' : 'translate-x-0 bg-neutral-400'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
            >
              {t('createCustomTimer')}
            </button>
          </form>
        </div>
      )}

      {/* Global Alarm Sound Selection Menu Modal */}
      {showSoundMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">{t('alarmSoundMenu')}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {t('alarmSoundDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSoundMenu(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {t('done')}
              </button>
            </div>

            {/* Sound options list */}
            <div className="space-y-2">
              {SOUND_OPTIONS.map(opt => {
                const isSelected = defaultSound === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectDefaultSound(opt.id, false)}
                    className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-600 bg-neutral-800/90 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                            : 'border-neutral-700 group-hover:border-neutral-500'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{opt.name}</span>
                          {isSelected && (
                            <span className="text-[10px] text-amber-400 font-medium">Default</span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{opt.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundService.playTone(opt.id);
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg border border-neutral-700/60 transition-colors cursor-pointer"
                      title={`Preview ${opt.name}`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{t('preview')}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Apply to active timers button */}
            {timers.length > 0 && (
              <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80 text-xs">
                <span className="text-neutral-400">{t('applyToAll')}:</span>
                <button
                  type="button"
                  onClick={() => handleSelectDefaultSound(defaultSound, true)}
                  className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors cursor-pointer"
                >
                  {t('applyToAll')}
                </button>
              </div>
            )}

            {/* Volume control & test full alarm */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <span>{t('volume')}: {isMuted ? t('mute') : `${Math.round(volume * 100)}%`}</span>
                </div>

                <button
                  type="button"
                  onClick={() => soundService.playTone(defaultSound)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  {t('testAlarm')}
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowSoundMenu(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

