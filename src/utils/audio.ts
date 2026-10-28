/**
 * Web Audio API synthesizer for retro-noir detective atmosphere,
 * procedural mystery forest ambiance, and crisp interactive audio feedback.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;

  // Ambient sound nodes
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private cricketInterval: any = null;

  constructor() {
    this.isMuted = typeof localStorage !== 'undefined' ? localStorage.getItem('detective_muted') === 'true' : false;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('detective_muted', String(this.isMuted));
    }

    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.08, now + 0.3);
    }

    if (!this.isMuted && !this.isAmbientPlaying) {
      this.startForestAmbient();
    }

    return this.isMuted;
  }

  /**
   * Generates procedural ambient forest sound:
   * - Nocturnal low mystery sub-drone (65Hz - 130Hz)
   * - Soft river stream & tree wind noise (filtered pink noise)
   * - Gentle periodic night crickets & leaves rustle
   */
  public startForestAmbient() {
    if (this.isMuted || this.isAmbientPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.isAmbientPlaying = true;
      const now = this.ctx.currentTime;

      // Master ambient gain node
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.08, now + 2.0); // Gentle fade-in
      this.ambientGain.connect(this.ctx.destination);

      // 1. Deep Mystery Forest Drone (Subtle mystery mood)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();

      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(65.41, now); // C2 low root

      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(98.0, now); // G2 fifth harmonic

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(220, now);

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(this.ambientGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);

      // 2. Wind & River Stream Ambient (Filtered Noise Buffer)
      const bufferSize = this.ctx.sampleRate * 3; // 3 seconds loop
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.05;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(380, now);
      windFilter.Q.setValueAtTime(1.8, now);

      // Slow LFO for rustling wind movement
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, now); // 5s wind cycle
      lfoGain.gain.setValueAtTime(140, now);
      lfo.connect(windFilter.frequency);
      lfo.start(now);

      this.noiseNode.connect(windFilter);
      windFilter.connect(this.ambientGain);
      this.noiseNode.start(now);

      // 3. Periodic Night Forest Crickets
      this.cricketInterval = setInterval(() => {
        if (!this.isMuted && this.isAmbientPlaying && Math.random() > 0.35) {
          this.triggerCricketChirp();
        }
      }, 3500);

    } catch (e) {
      console.warn('Ambient forest sound init:', e);
    }
  }

  public stopForestAmbient() {
    this.isAmbientPlaying = false;
    if (this.cricketInterval) {
      clearInterval(this.cricketInterval);
      this.cricketInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.noiseNode?.stop();
        } catch (_) {}
      }, 900);
    }
  }

  private triggerCricketChirp() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 4200 + Math.random() * 600;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq + 300, now + 0.04);
    osc.frequency.setValueAtTime(baseFreq, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Sound effect: Hovering over buttons/stations
   */
  public playHover() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(940, now + 0.04);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Sound effect: Selecting a clue station (Crisp detective mechanical lens click)
   */
  public playClueClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Dual-stage camera shutter / forensic lens click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.05);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, now + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.09);
    gain2.gain.setValueAtTime(0.12, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.03);
    osc2.stop(now + 0.09);

    // Also trigger clue found sparkle
    setTimeout(() => this.playClueFound(), 60);
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playOptionSelect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playClueFound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  /**
   * Sound effect: Success chime for correct answers (Harmonic detective triumph fanfare)
   */
  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Radiant mystery victory chord progression: F#4 -> A4 -> C#5 -> E5 -> A5
    const chords = [
      { f: 370.0, d: 0.3, vol: 0.12 },
      { f: 440.0, d: 0.35, vol: 0.12 },
      { f: 554.37, d: 0.4, vol: 0.14 },
      { f: 659.25, d: 0.45, vol: 0.15 },
      { f: 880.0, d: 0.65, vol: 0.16 }
    ];

    chords.forEach((note, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.065;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(note.vol, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + note.d);
    });
  }

  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.28);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 392, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.35 },
      { f: 880, d: 0.2 },
      { f: 1046.5, d: 0.7 }
    ];

    let t = now;
    fanfare.forEach(note => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);

      t += note.d * 0.85;
    });
  }
}

export const soundManager = new SoundManager();
