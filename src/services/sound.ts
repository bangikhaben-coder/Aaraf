import { SoundTone } from '../types';

class SoundService {
  private ctx: AudioContext | null = null;
  private volume: number = 0.8;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setIsMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playTone(tone: SoundTone = 'bell') {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    switch (tone) {
      case 'bell':
        this.playBellTone(ctx);
        break;
      case 'digital':
        this.playDigitalTone(ctx);
        break;
      case 'analog':
        this.playAnalogTone(ctx);
        break;
      case 'gong':
        this.playGongTone(ctx);
        break;
      case 'woodblock':
        this.playWoodblockTone(ctx);
        break;
      case 'ping':
        this.playPingTone(ctx);
        break;
      default:
        this.playBellTone(ctx);
    }
  }

  private playAnalogTone(ctx: AudioContext) {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // Twin-bell mechanical alarm rhythm: rapid alternating strikes
    const strikes = 8;
    const interval = 0.07; // ~14 strikes per second
    const freqs = [1480, 1820]; // two alternating bell cups

    for (let i = 0; i < strikes; i++) {
      const strikeTime = now + i * interval;
      const freq = freqs[i % 2];

      const osc = ctx.createOscillator();
      const strikeGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, strikeTime);
      // Slight pitch droop on strike
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, strikeTime + 0.06);

      strikeGain.gain.setValueAtTime(0, strikeTime);
      strikeGain.gain.linearRampToValueAtTime(0.8, strikeTime + 0.003);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.065);

      osc.connect(strikeGain);
      strikeGain.connect(masterGain);

      osc.start(strikeTime);
      osc.stop(strikeTime + 0.07);
    }
  }

  private playBellTone(ctx: AudioContext) {
    const now = ctx.currentTime;
    const baseFreq = 587.33; // D5
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2.0, baseFreq * 2.76];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.4, now);
    masterGain.connect(ctx.destination);

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 1 / (idx + 1);
      const decay = 2.2 - idx * 0.3;

      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  private playGongTone(ctx: AudioContext) {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.5, now);
    masterGain.connect(ctx.destination);

    const freqs = [220, 277.18, 329.63, 440];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const decay = 3.5 - idx * 0.4;
      gain.gain.setValueAtTime(0.8 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  private playDigitalTone(ctx: AudioContext) {
    const now = ctx.currentTime;
    const beeps = [880, 1046.5, 1318.5]; // A5, C6, E6
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, now);
    masterGain.connect(ctx.destination);

    beeps.forEach((freq, index) => {
      const startTime = now + index * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  private playWoodblockTone(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  private playPingTone(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now); // A6

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  public playTick() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(this.volume * 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }
}

export const soundService = new SoundService();
