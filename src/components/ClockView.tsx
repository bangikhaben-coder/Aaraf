import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sun, Moon, Bell, BellOff, Globe } from 'lucide-react';
import { WorldClockCity } from '../types';
import { POPULAR_CITIES, getTimeInZone } from '../services/timezones';
import { soundService } from '../services/sound';
import { useLanguage } from '../i18n/LanguageContext';

interface ClockViewProps {
  hourlyChime: boolean;
  onToggleHourlyChime: () => void;
}

export const ClockView: React.FC<ClockViewProps> = ({
  hourlyChime,
  onToggleHourlyChime,
}) => {
  const { t, currentLanguage } = useLanguage();
  const [now, setNow] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [viewStyle, setViewStyle] = useState<'digital' | 'analog'>('digital');
  const [showAddCityModal, setShowAddCityModal] = useState<boolean>(false);
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');

  const [pinnedCities, setPinnedCities] = useState<WorldClockCity[]>(() => {
    const saved = localStorage.getItem('chronos_pinned_cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      POPULAR_CITIES.find(c => c.id === 'tokyo')!,
      POPULAR_CITIES.find(c => c.id === 'london')!,
      POPULAR_CITIES.find(c => c.id === 'new_york')!,
      POPULAR_CITIES.find(c => c.id === 'san_francisco')!,
    ].filter(Boolean);
  });

  // Ticking effect
  useEffect(() => {
    let lastHour = new Date().getHours();
    const interval = setInterval(() => {
      const current = new Date();
      setNow(current);

      // Hourly chime trigger
      if (hourlyChime && current.getMinutes() === 0 && current.getSeconds() === 0 && current.getHours() !== lastHour) {
        lastHour = current.getHours();
        soundService.playTone('bell');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [hourlyChime]);

  // Save pinned cities
  useEffect(() => {
    localStorage.setItem('chronos_pinned_cities', JSON.stringify(pinnedCities));
  }, [pinnedCities]);

  // Calculations for local time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  const displayHours = is24Hour ? hours : hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Day percentage
  const totalSecondsToday = hours * 3600 + minutes * 60 + seconds;
  const dayProgressPercent = ((totalSecondsToday / 86400) * 100).toFixed(1);

  // Formatted date string with current language locale
  const dateFormatted = now.toLocaleDateString(currentLanguage || 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Analog angles
  const secondAngle = ((seconds + milliseconds / 1000) / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

  const handleAddCity = (city: WorldClockCity) => {
    if (!pinnedCities.some(c => c.id === city.id)) {
      setPinnedCities(prev => [...prev, city]);
    }
    setShowAddCityModal(false);
    setCitySearchQuery('');
  };

  const handleRemoveCity = (id: string) => {
    setPinnedCities(prev => prev.filter(c => c.id !== id));
  };

  const filteredAvailableCities = POPULAR_CITIES.filter(
    c => !pinnedCities.some(p => p.id === c.id) &&
      (c.city.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
       c.country.toLowerCase().includes(citySearchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      {/* Primary Local Time Showcase */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 sm:p-12 text-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial from-neutral-800/20 via-transparent to-transparent pointer-events-none" />

        {/* Top Controls Strip */}
        <div className="relative flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Globe className="w-4 h-4 text-neutral-500" />
            <span>{timeZoneName}</span>
            <span aria-hidden="true">·</span>
            <span>{t('localTime')}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* 12h / 24h toggle */}
            <div className="flex items-center rounded-lg bg-neutral-800/80 p-0.5 text-xs font-medium">
              <button
                onClick={() => setIs24Hour(true)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  is24Hour ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                24H
              </button>
              <button
                onClick={() => setIs24Hour(false)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  !is24Hour ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                12H
              </button>
            </div>

            {/* Digital / Analog Toggle */}
            <div className="flex items-center rounded-lg bg-neutral-800/80 p-0.5 text-xs font-medium">
              <button
                onClick={() => setViewStyle('digital')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewStyle === 'digital' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {t('digital')}
              </button>
              <button
                onClick={() => setViewStyle('analog')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewStyle === 'analog' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {t('analog')}
              </button>
            </div>

            {/* Hourly chime toggle */}
            <button
              onClick={onToggleHourlyChime}
              title={hourlyChime ? 'Hourly chime enabled' : 'Hourly chime disabled'}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                hourlyChime
                  ? 'bg-neutral-800 border-neutral-700 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {hourlyChime ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{t('chime')}</span>
            </button>
          </div>
        </div>

        {/* Main Display: Digital or Analog */}
        {viewStyle === 'digital' ? (
          <div className="py-4">
            <div className="flex items-baseline justify-center gap-2 sm:gap-4 font-mono-time tracking-tight">
              <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-white tabular-nums">
                {pad(displayHours)}:{pad(minutes)}
              </span>
              <div className="flex flex-col items-start">
                <span className="text-3xl sm:text-5xl md:text-6xl font-light text-neutral-400 tabular-nums">
                  :{pad(seconds)}
                </span>
                {!is24Hour && (
                  <span className="text-sm sm:text-base font-semibold tracking-wider text-neutral-400 uppercase mt-1">
                    {ampm}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-medium">
              {dateFormatted}
            </p>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center">
            {/* SVG Analog Clock */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-neutral-800 bg-neutral-950 flex items-center justify-center shadow-inner">
              {/* Dial markings */}
              {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                const isQuarter = i % 3 === 0;
                return (
                  <div
                    key={i}
                    className="absolute w-full h-full flex justify-center items-start pt-2 pointer-events-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div
                      className={`${
                        isQuarter ? 'h-3.5 w-1 bg-white' : 'h-2 w-0.5 bg-neutral-600'
                      } rounded-full`}
                    />
                  </div>
                );
              })}

              {/* Hour hand */}
              <div
                className="absolute w-1.5 h-20 bg-neutral-200 rounded-full origin-bottom"
                style={{
                  transform: `translateY(-50%) rotate(${hourAngle}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />

              {/* Minute hand */}
              <div
                className="absolute w-1 h-28 bg-white rounded-full origin-bottom"
                style={{
                  transform: `translateY(-50%) rotate(${minuteAngle}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />

              {/* Second hand */}
              <div
                className="absolute w-0.5 h-32 bg-amber-400 rounded-full origin-bottom"
                style={{
                  transform: `translateY(-50%) rotate(${secondAngle}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />

              {/* Center pivot */}
              <div className="absolute w-3 h-3 bg-white rounded-full border-2 border-neutral-950 shadow-md" />
            </div>

            <div className="mt-6 text-center">
              <span className="font-mono-time text-2xl font-semibold text-white">
                {pad(displayHours)}:{pad(minutes)}:{pad(seconds)} {!is24Hour && ampm}
              </span>
              <p className="text-sm text-neutral-400 mt-1">{dateFormatted}</p>
            </div>
          </div>
        )}

        {/* Day progress bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>{t('dayProgress')}</span>
            <span className="font-mono-time font-medium text-neutral-200">{dayProgressPercent}% {t('completed')}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-300 transition-all duration-500 rounded-full"
              style={{ width: `${dayProgressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* World Clock Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{t('worldClock')}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">{t('worldClockDesc')}</p>
          </div>
          <button
            onClick={() => setShowAddCityModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addCity')}</span>
          </button>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pinnedCities.map(city => {
            const timeInfo = getTimeInZone(city.timeZone, now);
            return (
              <div
                key={city.id}
                className="group relative rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-neutral-100">
                        {city.city}
                      </h3>
                      <p className="text-xs text-neutral-400">{city.country}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {timeInfo.isDay ? (
                        <span title="Daytime">
                          <Sun className="w-4 h-4 text-amber-400/90" />
                        </span>
                      ) : (
                        <span title="Nighttime">
                          <Moon className="w-4 h-4 text-indigo-400/90" />
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveCity(city.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-rose-400 transition-all rounded"
                        title="Remove city"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="font-mono-time text-2xl font-bold text-white tracking-tight">
                      {timeInfo.formattedTime}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
                  <span>{timeInfo.dateString}</span>
                  <span className="font-mono-time font-medium text-neutral-300">
                    {timeInfo.diffString}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add City Modal */}
      {showAddCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{t('addCity')}</h3>
              <button
                onClick={() => {
                  setShowAddCityModal(false);
                  setCitySearchQuery('');
                }}
                className="text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {t('close')}
              </button>
            </div>

            <input
              type="text"
              placeholder={t('searchCity')}
              value={citySearchQuery}
              onChange={e => setCitySearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none mb-4"
              autoFocus
            />

            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 divide-y divide-neutral-800/40">
              {filteredAvailableCities.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">
                  No cities found or all popular cities already pinned.
                </p>
              ) : (
                filteredAvailableCities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleAddCity(city)}
                    className="w-full flex items-center justify-between p-2.5 text-left rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{city.city}</p>
                      <p className="text-xs text-neutral-400">{city.country}</p>
                    </div>
                    <span className="text-xs text-neutral-500">{city.timeZone}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
