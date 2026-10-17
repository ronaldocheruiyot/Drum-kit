export type DrumId =
  | 'kick'
  | 'snare'
  | 'hatClosed'
  | 'hatOpen'
  | 'clap'
  | 'tom'
  | 'cowbell'
  | 'laser'
  | 'coin'
  | 'jump'
  | 'powerup'
  | 'explosion';

export interface DrumTrackMeta {
  id: DrumId;
  name: string;
  shortName: string;
  category: 'DRUMS' | 'PERC' | 'ARCADE';
  color: string;
  defaultPitch: number; // 0.5 to 2.0 multiplier
}

export const DRUM_TRACKS: DrumTrackMeta[] = [
  { id: 'kick', name: '808 Sub Kick', shortName: 'KICK', category: 'DRUMS', color: '#10B981', defaultPitch: 1.0 },
  { id: 'snare', name: 'Noise Snare', shortName: 'SNARE', category: 'DRUMS', color: '#10B981', defaultPitch: 1.0 },
  { id: 'hatClosed', name: 'Closed Hat', shortName: 'CH-HAT', category: 'DRUMS', color: '#10B981', defaultPitch: 1.0 },
  { id: 'hatOpen', name: 'Open Hat', shortName: 'OP-HAT', category: 'DRUMS', color: '#10B981', defaultPitch: 1.0 },
  { id: 'clap', name: '8-Bit Clap', shortName: 'CLAP', category: 'PERC', color: '#06B6D4', defaultPitch: 1.0 },
  { id: 'tom', name: 'Square Tom', shortName: 'TOM', category: 'PERC', color: '#06B6D4', defaultPitch: 1.0 },
  { id: 'cowbell', name: 'Dual Cowbell', shortName: 'COWBL', category: 'PERC', color: '#06B6D4', defaultPitch: 1.0 },
  { id: 'laser', name: 'Arcade Laser', shortName: 'LASER', category: 'ARCADE', color: '#F59E0B', defaultPitch: 1.0 },
  { id: 'coin', name: '1-Up Coin', shortName: 'COIN', category: 'ARCADE', color: '#F59E0B', defaultPitch: 1.0 },
  { id: 'jump', name: 'Pixel Jump', shortName: 'JUMP', category: 'ARCADE', color: '#F59E0B', defaultPitch: 1.0 },
  { id: 'powerup', name: 'Warp Powerup', shortName: 'PWRUP', category: 'ARCADE', color: '#F59E0B', defaultPitch: 1.0 },
  { id: 'explosion', name: 'Boss Boom', shortName: 'BOOM', category: 'ARCADE', color: '#F59E0B', defaultPitch: 1.0 },
];

export type SynthWaveType = 'square' | 'sawtooth' | 'triangle' | 'sine' | 'pulse25' | 'fmBell' | 'acidBass' | 'chipLead';

export interface SynthPatch {
  wave: SynthWaveType;
  octave: number; // -2 to +2
  attack: number; // 0.005 to 0.5
  decay: number; // 0.05 to 1.0
  sustain: number; // 0.0 to 1.0
  release: number; // 0.02 to 1.5
  cutoff: number; // 200 to 12000 Hz
  resonance: number; // 0.5 to 15
  arpMode: 'OFF' | 'UP' | 'DOWN' | 'OCTAVE';
}

export interface MasterFX {
  volume: number; // 0 to 1
  bitcrush: number; // 0 to 1
  delayTime: number; // 0.08 to 0.6s
  delayFeedback: number; // 0 to 0.75
  delayMix: number; // 0 to 0.7
  filterCutoff: number; // 200 to 16000 Hz
}

// 0 = Off, 1 = Normal, 2 = Accent (Louder + slight pitch boost)
export type StepValue = 0 | 1 | 2;

export type DrumGrid = Record<DrumId, StepValue[]>;

// Note index in NOTES array, or null if rest
export type SynthStepNote = number | null;

export interface NoteDef {
  name: string;
  freq: number;
  isBlack: boolean;
  keyShortcut: string;
}

export const SYNTH_NOTES: NoteDef[] = [
  { name: 'C3', freq: 130.81, isBlack: false, keyShortcut: 'Z' },
  { name: 'C#3', freq: 138.59, isBlack: true, keyShortcut: 'S' },
  { name: 'D3', freq: 146.83, isBlack: false, keyShortcut: 'X' },
  { name: 'D#3', freq: 155.56, isBlack: true, keyShortcut: 'D' },
  { name: 'E3', freq: 164.81, isBlack: false, keyShortcut: 'C' },
  { name: 'F3', freq: 174.61, isBlack: false, keyShortcut: 'V' },
  { name: 'F#3', freq: 185.00, isBlack: true, keyShortcut: 'G' },
  { name: 'G3', freq: 196.00, isBlack: false, keyShortcut: 'B' },
  { name: 'G#3', freq: 207.65, isBlack: true, keyShortcut: 'H' },
  { name: 'A3', freq: 220.00, isBlack: false, keyShortcut: 'N' },
  { name: 'A#3', freq: 233.08, isBlack: true, keyShortcut: 'J' },
  { name: 'B3', freq: 246.94, isBlack: false, keyShortcut: 'M' },
  { name: 'C4', freq: 261.63, isBlack: false, keyShortcut: 'Q' },
  { name: 'C#4', freq: 277.18, isBlack: true, keyShortcut: '2' },
  { name: 'D4', freq: 293.66, isBlack: false, keyShortcut: 'W' },
  { name: 'D#4', freq: 311.13, isBlack: true, keyShortcut: '3' },
  { name: 'E4', freq: 329.63, isBlack: false, keyShortcut: 'E' },
  { name: 'F4', freq: 349.23, isBlack: false, keyShortcut: 'R' },
  { name: 'F#4', freq: 369.99, isBlack: true, keyShortcut: '5' },
  { name: 'G4', freq: 392.00, isBlack: false, keyShortcut: 'T' },
  { name: 'G#4', freq: 415.30, isBlack: true, keyShortcut: '6' },
  { name: 'A4', freq: 440.00, isBlack: false, keyShortcut: 'Y' },
  { name: 'A#4', freq: 466.16, isBlack: true, keyShortcut: '7' },
  { name: 'B4', freq: 493.88, isBlack: false, keyShortcut: 'U' },
  { name: 'C5', freq: 523.25, isBlack: false, keyShortcut: 'I' },
];

export interface PresetPattern {
  id: string;
  name: string;
  bpm: number;
  swing: number;
  drums: DrumGrid;
  synthSteps: SynthStepNote[];
  synthPatch: Partial<SynthPatch>;
}

const emptySteps = (): StepValue[] => Array(16).fill(0) as StepValue[];

export function createEmptyDrumGrid(): DrumGrid {
  return {
    kick: emptySteps(),
    snare: emptySteps(),
    hatClosed: emptySteps(),
    hatOpen: emptySteps(),
    clap: emptySteps(),
    tom: emptySteps(),
    cowbell: emptySteps(),
    laser: emptySteps(),
    coin: emptySteps(),
    jump: emptySteps(),
    powerup: emptySteps(),
    explosion: emptySteps(),
  };
}

export const PRESET_PATTERNS: PresetPattern[] = [
  {
    id: 'mega-boss',
    name: 'Mega Boss Stage',
    bpm: 132,
    swing: 0,
    drums: {
      ...createEmptyDrumGrid(),
      kick:      [2, 0, 0, 1, 0, 0, 2, 0, 2, 0, 1, 0, 0, 1, 0, 0],
      snare:     [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 1],
      hatClosed: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      hatOpen:   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0],
      tom:       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 0],
      laser:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2],
      coin:      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    synthSteps: [0, 0, 12, 0, 3, 0, 7, 10, 0, 0, 12, 15, 7, 5, 3, 2],
    synthPatch: { wave: 'pulse25', octave: 0, cutoff: 4200, resonance: 4.5, arpMode: 'OCTAVE' },
  },
  {
    id: 'neon-outrun',
    name: 'Outrun Highway',
    bpm: 118,
    swing: 12,
    drums: {
      ...createEmptyDrumGrid(),
      kick:      [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 1, 0],
      snare:     [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      clap:      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
      hatClosed: [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      hatOpen:   [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0],
      cowbell:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    },
    synthSteps: [9, 9, 21, 9, 12, 9, 16, 14, 5, 5, 17, 5, 7, 7, 19, 16],
    synthPatch: { wave: 'sawtooth', octave: 0, cutoff: 3500, resonance: 6.0, arpMode: 'OFF' },
  },
  {
    id: 'acid-dungeon',
    name: 'Acid Dungeon 303',
    bpm: 138,
    swing: 8,
    drums: {
      ...createEmptyDrumGrid(),
      kick:      [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
      hatClosed: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
      hatOpen:   [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      clap:      [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      laser:     [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      explosion: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    synthSteps: [0, 12, 0, 1, 0, 13, 3, null, 0, 12, 7, 6, 0, 15, 12, 10],
    synthPatch: { wave: 'acidBass', octave: -1, cutoff: 1800, resonance: 11.5, arpMode: 'OFF' },
  },
  {
    id: 'star-warp',
    name: 'Star Warp Zone',
    bpm: 150,
    swing: 0,
    drums: {
      ...createEmptyDrumGrid(),
      kick:      [2, 0, 1, 0, 0, 0, 2, 0, 1, 0, 0, 2, 0, 0, 1, 0],
      snare:     [0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 0, 0, 2, 0, 0, 1],
      hatClosed: [2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 1, 1, 1],
      coin:      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      jump:      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0],
      powerup:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    },
    synthSteps: [12, 16, 19, 24, 19, 16, 12, 7, 14, 17, 21, 24, 21, 17, 14, 11],
    synthPatch: { wave: 'chipLead', octave: 0, cutoff: 6800, resonance: 2.5, arpMode: 'UP' },
  },
];

class WebAudioEngine {
  public ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private masterFilter: BiquadFilterNode | null = null;
  private shaperNode: WaveShaperNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private delayWetGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private pulse25Wave: PeriodicWave | null = null;

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Create master nodes
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.value = 14000;
    this.masterFilter.Q.value = 1.0;

    this.shaperNode = this.ctx.createWaveShaper();
    this.updateBitcrushCurve(0.15);

    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.value = 0.22;

    this.delayFeedbackGain = this.ctx.createGain();
    this.delayFeedbackGain.gain.value = 0.35;

    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.value = 0.2;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.75;

    // Routing:
    // Source -> masterFilter -> shaperNode -> masterGain -> analyser -> destination
    // And shaperNode -> delayNode -> delayWetGain -> masterGain
    this.masterFilter.connect(this.shaperNode);
    this.shaperNode.connect(this.masterGain);

    this.shaperNode.connect(this.delayNode);
    this.delayNode.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.delayWetGain);
    this.delayWetGain.connect(this.masterGain);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Create 2-second white/LFSR noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    let lfsr = 0xace1;
    for (let i = 0; i < bufferSize; i++) {
      // Mix pseudo-random and crisp 8-bit noise
      if (i % 3 === 0) {
        const bit = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5)) & 1;
        lfsr = (lfsr >> 1) | (bit << 15);
      }
      output[i] = ((lfsr & 1) ? 0.6 : -0.6) + (Math.random() * 0.8 - 0.4);
    }

    // Create 25% duty cycle NES pulse wave via Fourier series
    const real = new Float32Array(32);
    const imag = new Float32Array(32);
    real[0] = 0;
    imag[0] = 0;
    const duty = 0.25;
    for (let n = 1; n < 32; n++) {
      real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
      imag[n] = (2 / (n * Math.PI)) * (1 - Math.cos(n * Math.PI * duty));
    }
    this.pulse25Wave = this.ctx.createPeriodicWave(real, imag);
  }

  public updateBitcrushCurve(amount: number) {
    if (!this.shaperNode) return;
    const samples = 4096;
    const curve = new Float32Array(samples);
    if (amount <= 0.02) {
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = x;
      }
    } else {
      // Quantize amplitude steps to create genuine 8-bit staircase crunch
      const steps = Math.max(3, Math.floor((1 - amount * 0.92) * 32));
      const drive = 1 + amount * 2.2;
      for (let i = 0; i < samples; i++) {
        const x = ((i * 2) / samples - 1) * drive;
        const clamped = Math.max(-1, Math.min(1, x));
        curve[i] = Math.round(clamped * steps) / steps;
      }
    }
    this.shaperNode.curve = curve;
  }

  public applyMasterFX(fx: MasterFX) {
    if (!this.ctx || !this.masterGain || !this.masterFilter || !this.delayNode || !this.delayFeedbackGain || !this.delayWetGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(fx.volume, now, 0.015);
    this.masterFilter.frequency.setTargetAtTime(fx.filterCutoff, now, 0.02);
    this.delayNode.delayTime.setTargetAtTime(fx.delayTime, now, 0.03);
    this.delayFeedbackGain.gain.setTargetAtTime(fx.delayFeedback, now, 0.02);
    this.delayWetGain.gain.setTargetAtTime(fx.delayMix, now, 0.02);
    this.updateBitcrushCurve(fx.bitcrush);
  }

  private getDestination(): AudioNode {
    this.init();
    return this.masterFilter!;
  }

  public triggerDrum(id: DrumId, stepVal: StepValue = 1, pitchMultiplier = 1.0, time?: number) {
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;

    const dest = this.getDestination();
    const t = time ?? this.ctx.currentTime;
    const vel = stepVal === 2 ? 1.25 : 0.85;
    const p = pitchMultiplier * (stepVal === 2 ? 1.06 : 1.0);

    switch (id) {
      case 'kick': {
        const osc = this.ctx.createOscillator();
        const clickOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        clickOsc.type = 'square';

        osc.frequency.setValueAtTime(155 * p, t);
        osc.frequency.exponentialRampToValueAtTime(34 * p, t + 0.14);

        clickOsc.frequency.setValueAtTime(280 * p, t);
        clickOsc.frequency.exponentialRampToValueAtTime(45 * p, t + 0.03);

        gain.gain.setValueAtTime(0.95 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(0.35 * vel, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        osc.connect(gain);
        clickOsc.connect(clickGain);
        clickGain.connect(gain);
        gain.connect(dest);

        osc.start(t);
        clickOsc.start(t);
        osc.stop(t + 0.25);
        clickOsc.stop(t + 0.04);
        break;
      }

      case 'snare': {
        // Noise burst
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900 * p, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.65 * vel, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.17);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(dest);

        // Body tone
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220 * p, t);
        osc.frequency.exponentialRampToValueAtTime(95 * p, t + 0.09);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.55 * vel, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(oscGain);
        oscGain.connect(dest);

        noise.start(t);
        noise.stop(t + 0.18);
        osc.start(t);
        osc.stop(t + 0.11);
        break;
      }

      case 'hatClosed': {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(8200 * p, t);
        filter.Q.setValueAtTime(2.5, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(t);
        noise.stop(t + 0.06);
        break;
      }

      case 'hatOpen': {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(7500 * p, t);
        filter.Q.setValueAtTime(1.8, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.48 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.28);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(t);
        noise.stop(t + 0.3);
        break;
      }

      case 'clap': {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500 * p, t);
        filter.Q.setValueAtTime(1.5, t);

        const gain = this.ctx.createGain();
        // Multi-burst envelope for classic 8-bit handclap
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.6 * vel, t + 0.004);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.012);
        gain.gain.linearRampToValueAtTime(0.6 * vel, t + 0.018);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.026);
        gain.gain.linearRampToValueAtTime(0.65 * vel, t + 0.032);
        gain.gain.exponentialRampToValueAtTime(0.002, t + 0.16);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(t);
        noise.stop(t + 0.17);
        break;
      }

      case 'tom': {
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(195 * p, t);
        osc.frequency.exponentialRampToValueAtTime(72 * p, t + 0.16);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.18);
        break;
      }

      case 'cowbell': {
        // Classic 808 dual square wave (540 Hz + 800 Hz)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(540 * p, t);
        osc2.frequency.setValueAtTime(800 * p, t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700 * p, t);
        filter.Q.setValueAtTime(2.5, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.13);
        osc2.stop(t + 0.13);
        break;
      }

      case 'laser': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400 * p, t);
        osc.frequency.exponentialRampToValueAtTime(95 * p, t + 0.14);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      }

      case 'coin': {
        // Classic Mario-style B5 -> E6 two-tone square chime
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77 * p, t); // B5
        osc.frequency.setValueAtTime(1318.51 * p, t + 0.065); // E6

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4 * vel, t);
        gain.gain.setValueAtTime(0.4 * vel, t + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.29);
        break;
      }

      case 'jump': {
        const osc = this.ctx.createOscillator();
        if (this.pulse25Wave) {
          osc.setPeriodicWave(this.pulse25Wave);
        } else {
          osc.type = 'square';
        }
        osc.frequency.setValueAtTime(160 * p, t);
        osc.frequency.linearRampToValueAtTime(420 * p, t + 0.07);
        osc.frequency.exponentialRampToValueAtTime(780 * p, t + 0.18);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.42 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.19);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      }

      case 'powerup': {
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        const freqs = [330, 392, 659, 523, 587, 784];
        freqs.forEach((f, idx) => {
          osc.frequency.setValueAtTime(f * p, t + idx * 0.032);
        });

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.38 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.23);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.24);
        break;
      }

      case 'explosion': {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950 * p, t);
        filter.frequency.exponentialRampToValueAtTime(110 * p, t + 0.38);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.75 * vel, t);
        gain.gain.exponentialRampToValueAtTime(0.002, t + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(t);
        noise.stop(t + 0.42);
        break;
      }
    }
  }

  public triggerSynthNote(freq: number, patch: SynthPatch, duration = 0.22, time?: number) {
    this.init();
    if (!this.ctx) return;

    const dest = this.getDestination();
    const t = time ?? this.ctx.currentTime;
    const baseFreq = freq * Math.pow(2, patch.octave);

    // Handle Arpeggiator sub-steps if enabled
    if (patch.arpMode !== 'OFF') {
      const subDur = duration / 3;
      const semitones =
        patch.arpMode === 'UP'
          ? [0, 4, 7]
          : patch.arpMode === 'DOWN'
            ? [12, 7, 4]
            : [0, 12, 24];
      semitones.forEach((semi, idx) => {
        const f = baseFreq * Math.pow(2, semi / 12);
        this.playRawSynthVoice(f, patch, subDur * 0.95, t + idx * subDur, dest);
      });
      return;
    }

    this.playRawSynthVoice(baseFreq, patch, duration, t, dest);
  }

  private playRawSynthVoice(
    freq: number,
    patch: SynthPatch,
    duration: number,
    t: number,
    dest: AudioNode
  ) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const envGain = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(patch.cutoff, t);
    filter.Q.setValueAtTime(patch.resonance, t);

    if (patch.wave === 'pulse25' && this.pulse25Wave) {
      osc.setPeriodicWave(this.pulse25Wave);
    } else if (patch.wave === 'fmBell') {
      osc.type = 'sine';
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      mod.type = 'square';
      mod.frequency.setValueAtTime(freq * 2.0, t);
      modGain.gain.setValueAtTime(freq * 1.8, t);
      modGain.gain.exponentialRampToValueAtTime(10, t + duration);
      mod.connect(modGain);
      modGain.connect(osc.frequency);
      mod.start(t);
      mod.stop(t + duration + patch.release + 0.05);
    } else if (patch.wave === 'acidBass') {
      osc.type = 'sawtooth';
      // Classic 303 resonant filter envelope sweep
      filter.frequency.setValueAtTime(Math.min(12000, patch.cutoff * 2.8), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(120, patch.cutoff * 0.35), t + duration * 0.85);
      filter.Q.setValueAtTime(Math.max(8, patch.resonance), t);
    } else if (patch.wave === 'chipLead') {
      osc.type = 'square';
      // Subtle 8-bit pitch vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(7.5, t);
      lfoGain.gain.setValueAtTime(freq * 0.018, t);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + duration + patch.release + 0.05);
    } else {
      osc.type = patch.wave as OscillatorType;
    }

    osc.frequency.setValueAtTime(freq, t);

    // ADSR Envelope
    const atk = Math.max(0.004, patch.attack);
    const dec = Math.max(0.02, patch.decay);
    const sus = Math.max(0.05, Math.min(1.0, patch.sustain));
    const rel = Math.max(0.02, patch.release);

    const peakGain = 0.36;
    envGain.gain.setValueAtTime(0.0001, t);
    envGain.gain.linearRampToValueAtTime(peakGain, t + atk);
    envGain.gain.exponentialRampToValueAtTime(Math.max(0.001, peakGain * sus), t + atk + dec);
    envGain.gain.setValueAtTime(Math.max(0.001, peakGain * sus), t + duration);
    envGain.gain.exponentialRampToValueAtTime(0.0001, t + duration + rel);

    osc.connect(filter);
    filter.connect(envGain);
    envGain.connect(dest);

    osc.start(t);
    osc.stop(t + duration + rel + 0.02);
  }
}

export const audioEngine = new WebAudioEngine();
