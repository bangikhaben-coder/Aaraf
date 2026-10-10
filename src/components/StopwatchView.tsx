import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Copy, Check } from 'lucide-react';
import { LapTime } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const StopwatchView: React.FC = () => {
  const { t } = useLanguage();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedTime;

      const updateTime = () => {
        setElapsedTime(performance.now() - startTimeRef.current);
        animationFrameRef.current = requestAnimationFrame(updateTime);
      };

      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (elapsedTime === 0) return;

    const previousTotal = laps.length > 0 ? laps[0].overallTime : 0;
    const currentLapTime = elapsedTime - previousTotal;

    const newLap: LapTime = {
      lapNumber: laps.length + 1,
      lapTime: currentLapTime,
      overallTime: elapsedTime,
    };

    setLaps(prev => [newLap, ...prev]);
  };

  // Format milliseconds into MM:SS.cs
  const formatTimeParts = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return {
      hours: hours > 0 ? `${pad(hours)}:` : '',
      minutes: pad(minutes),
      seconds: pad(seconds),
      centiseconds: pad(centiseconds),
    };
  };

  const mainTime = formatTimeParts(elapsedTime);

  // Find fastest and slowest laps (if at least 2 laps)
  let fastestLapIdx = -1;
  let slowestLapIdx = -1;

  if (laps.length >= 2) {
    let minTime = Infinity;
    let maxTime = -Infinity;

    laps.forEach((l, idx) => {
      if (l.lapTime < minTime) {
        minTime = l.lapTime;
        fastestLapIdx = idx;
      }
      if (l.lapTime > maxTime) {
        maxTime = l.lapTime;
        slowestLapIdx = idx;
      }
    });
  }

  const handleCopyLaps = () => {
    if (laps.length === 0) return;
    const text = laps
      .map(l => {
        const lapFormatted = formatTimeParts(l.lapTime);
        const overallFormatted = formatTimeParts(l.overallTime);
        return `Lap ${l.lapNumber}: ${lapFormatted.minutes}:${lapFormatted.seconds}.${lapFormatted.centiseconds} (Total: ${overallFormatted.minutes}:${overallFormatted.seconds}.${overallFormatted.centiseconds})`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Stopwatch Hero Showcase */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 sm:p-14 text-center">
        <div className="absolute inset-0 bg-radial from-neutral-800/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-6">
          <span>{t('precisionStopwatch')}</span>
          <span aria-hidden="true">·</span>
          <span>1/100s</span>
        </div>

        {/* Large Monospace Time Display */}
        <div className="py-6 flex items-baseline justify-center font-mono-time tracking-tight">
          {mainTime.hours && (
            <span className="text-5xl sm:text-7xl md:text-8xl font-bold text-white tabular-nums">
              {mainTime.hours}
            </span>
          )}
          <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-white tabular-nums">
            {mainTime.minutes}:{mainTime.seconds}
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-light text-neutral-400 tabular-nums ml-1">
            .{mainTime.centiseconds}
          </span>
        </div>

        {/* Primary Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartStop}
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
                <span>{elapsedTime > 0 ? t('resume') : t('start')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning && elapsedTime === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 transition-colors border border-neutral-700 cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>{t('lap')}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={elapsedTime === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title={t('reset')}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('reset')}</span>
          </button>
        </div>

        {/* Keyboard cues */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-neutral-500">
          <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px]">Space</kbd> {t('start')}/{t('pause')}</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px]">L</kbd> {t('lap')}</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px]">R</kbd> {t('reset')}</span>
        </div>
      </section>

      {/* Lap Times Section */}
      {laps.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">{t('lapSplits')} ({laps.length})</h3>
              <p className="text-xs text-neutral-400">{t('splitsDesc')}</p>
            </div>

            <button
              onClick={handleCopyLaps}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('copied') : t('copySplits')}</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden divide-y divide-neutral-800/60">
            {/* Table Header */}
            <div className="grid grid-cols-4 px-5 py-2.5 text-xs font-semibold text-neutral-400 bg-neutral-950/40">
              <span>{t('lap')}</span>
              <span className="text-right">{t('lap')}</span>
              <span className="text-right">{t('totalTime')}</span>
              <span className="text-right">{t('performance')}</span>
            </div>

            {/* Lap Rows */}
            <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/40">
              {laps.map((lap, idx) => {
                const lapFmt = formatTimeParts(lap.lapTime);
                const totalFmt = formatTimeParts(lap.overallTime);
                const isFastest = idx === fastestLapIdx;
                const isSlowest = idx === slowestLapIdx;

                return (
                  <div
                    key={lap.lapNumber}
                    className="grid grid-cols-4 items-center px-5 py-3 text-xs hover:bg-neutral-800/30 transition-colors"
                  >
                    <span className="font-medium text-neutral-300">
                      {t('lap')} {lap.lapNumber.toString().padStart(2, '0')}
                    </span>

                    <span className="font-mono-time text-right font-semibold text-white tabular-nums">
                      {lapFmt.minutes}:{lapFmt.seconds}.{lapFmt.centiseconds}
                    </span>

                    <span className="font-mono-time text-right text-neutral-400 tabular-nums">
                      {totalFmt.minutes}:{totalFmt.seconds}.{totalFmt.centiseconds}
                    </span>

                    <div className="text-right">
                      {isFastest ? (
                        <span className="text-emerald-400 font-medium">{t('fastest')}</span>
                      ) : isSlowest ? (
                        <span className="text-rose-400 font-medium">{t('slowest')}</span>
                      ) : (
                        <span className="text-neutral-500">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
