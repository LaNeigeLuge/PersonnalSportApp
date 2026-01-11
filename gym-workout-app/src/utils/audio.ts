// Simple beep sounds using Web Audio API
class AudioManager {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playBeep(frequency: number, duration: number, volume: number = 0.3) {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  // Different sounds for different events
  exerciseStart() {
    // Higher pitch, short beep
    this.playBeep(800, 0.15);
    setTimeout(() => this.playBeep(1000, 0.15), 150);
  }

  transition() {
    // Mid pitch, single beep
    this.playBeep(600, 0.2);
  }

  breakStart() {
    // Lower pitch, longer
    this.playBeep(400, 0.3);
  }

  sessionComplete() {
    // Three ascending beeps
    this.playBeep(600, 0.15);
    setTimeout(() => this.playBeep(800, 0.15), 150);
    setTimeout(() => this.playBeep(1000, 0.2), 300);
  }

  countdown() {
    // Quick high beep for 3-2-1 countdown
    this.playBeep(1200, 0.1);
  }
}

export const audioManager = new AudioManager();

// Vibration utility
export const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};
