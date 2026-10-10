/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ClockView } from './components/ClockView';
import { TimerView } from './components/TimerView';
import { StopwatchView } from './components/StopwatchView';
import { FocusView } from './components/FocusView';
import { ZenClockModal } from './components/ZenClockModal';
import { LanguageModal } from './components/LanguageModal';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ActiveTab } from './types';
import { soundService } from './services/sound';

function MainApp() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('clock');
  const [showZenClock, setShowZenClock] = useState<boolean>(false);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundService.getIsMuted());

  const [hourlyChime, setHourlyChime] = useState<boolean>(() => {
    return localStorage.getItem('chronos_hourly_chime') === 'true';
  });

  const toggleHourlyChime = () => {
    setHourlyChime(prev => {
      const next = !prev;
      localStorage.setItem('chronos_hourly_chime', String(next));
      if (next) {
        soundService.playTone('bell');
      }
      return next;
    });
  };

  const handleToggleMute = () => {
    const next = soundService.toggleMute();
    setIsMuted(next);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1') {
        setActiveTab('clock');
      } else if (e.key === '2') {
        setActiveTab('timer');
      } else if (e.key === '3') {
        setActiveTab('stopwatch');
      } else if (e.key === '4') {
        setActiveTab('focus');
      } else if (e.key.toLowerCase() === 'f' && !showZenClock) {
        setShowZenClock(true);
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showZenClock]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenZen={() => setShowZenClock(true)}
        onOpenLanguage={() => setShowLanguageModal(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'clock' && (
          <ClockView
            hourlyChime={hourlyChime}
            onToggleHourlyChime={toggleHourlyChime}
          />
        )}

        {activeTab === 'timer' && <TimerView />}

        {activeTab === 'stopwatch' && <StopwatchView />}

        {activeTab === 'focus' && <FocusView />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="flex items-center justify-center gap-2">
          <span>{t('footerTagline')}</span>
          <span aria-hidden="true">·</span>
          <span>Press 1-4 for views, F for ambient full screen</span>
        </div>
      </footer>

      {/* Fullscreen Zen Ambient Clock Modal */}
      {showZenClock && (
        <ZenClockModal onClose={() => setShowZenClock(false)} />
      )}

      {/* Language System Modal */}
      {showLanguageModal && (
        <LanguageModal onClose={() => setShowLanguageModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

