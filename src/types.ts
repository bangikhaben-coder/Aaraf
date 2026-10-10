export type ActiveTab = 'clock' | 'timer' | 'stopwatch' | 'focus';

export interface WorldClockCity {
  id: string;
  city: string;
  country: string;
  timeZone: string;
  flag?: string;
}

export interface ActiveTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  soundType: SoundTone;
  repeat: boolean;
  createdAt: number;
}

export interface LapTime {
  lapNumber: number;
  lapTime: number; // in milliseconds
  overallTime: number; // in milliseconds
}

export type SoundTone = 'bell' | 'digital' | 'analog' | 'gong' | 'woodblock' | 'ping';

export interface SoundOption {
  id: SoundTone;
  name: string;
  description: string;
}

export const SOUND_OPTIONS: SoundOption[] = [
  { id: 'bell', name: 'Soft Bell', description: 'Warm harmonic chime, gentle and melodic' },
  { id: 'digital', name: 'Digital Beep', description: 'Crisp electronic sequence, clear and modern' },
  { id: 'analog', name: 'Analog Clock', description: 'Mechanical twin-bell alarm chime' },
  { id: 'gong', name: 'Zen Gong', description: 'Deep resonant singing bowl with slow decay' },
  { id: 'woodblock', name: 'Woodblock', description: 'Natural organic percussion strike' },
  { id: 'ping', name: 'Crystal Ping', description: 'High-frequency crystalline accent' },
];


export type ZenTheme = 'minimal' | 'amber' | 'emerald' | 'indigo' | 'sand';

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
}

export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';
