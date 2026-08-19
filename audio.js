/**
 * Audio Engine for Kids Number Quest
 * Uses Web Audio API for 100% reliable, offline sound synthesis.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.voiceEnabled = true;
    this.masterGain = null;
    this.speechSynth = window.speechSynthesis || null;
    this.preferredVoice = null;

    this.initVoice();
    if (this.speechSynth && this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = () => this.initVoice();
    }
  }

  // Find the best cheerful girl / female voice available on the system
  initVoice() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize young, clear female/girl voices
    const femaleKeywords = [
      'girl', 'child', 'zira', 'jenny', 'samantha', 'victoria', 
      'google uk english female', 'google us english female', 'karen', 
      'fiona', 'moira', 'tessa', 'susan', 'female'
    ];

    // 1. Try finding by female voice keyword
    for (const keyword of femaleKeywords) {
      const match = voices.find(v => v.name.toLowerCase().includes(keyword) && v.lang.startsWith('en'));
      if (match) {
        this.preferredVoice = match;
        return;
      }
    }

    // 2. Fallback to any English female voice or first English voice
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || !v.name.toLowerCase().includes('david')));
    if (enVoice) {
      this.preferredVoice = enVoice;
    } else {
      this.preferredVoice = voices[0];
    }
  }

  // Lazy-initialize Web Audio Context on first user interaction
  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    return !this.isMuted;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }

  /**
   * CORRECT ANSWER SOUND
   * Cheerful, bright ascending major arpeggio (C5 -> E5 -> G5 -> C6) with sparkle
   */
  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });

    // Add a high twinkle on top
    const twinkle = ctx.createOscillator();
    const twinkleGain = ctx.createGain();
    twinkle.type = 'sine';
    twinkle.frequency.setValueAtTime(1567.98, now + 0.25); // G6
    twinkleGain.gain.setValueAtTime(0, now + 0.25);
    twinkleGain.gain.linearRampToValueAtTime(0.15, now + 0.28);
    twinkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    twinkle.connect(twinkleGain);
    twinkleGain.connect(this.masterGain);
    twinkle.start(now + 0.25);
    twinkle.stop(now + 0.56);
  }

  /**
   * INCORRECT ANSWER SOUND
   * Playful, gentle cartoon "boing" wobble (downward pitch bend, soft low-pass filter)
   * Non-punitive, funny and encouraging for kids!
   */
  playIncorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Pitch-bending oscillator for the "boing/wobble"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    // Frequency bend from 320Hz down to 140Hz
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.38);

    // Subtle vibrato (LFO) for the cartoon wobble
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(18, now); // 18Hz wobble
    lfoGain.gain.setValueAtTime(25, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + 0.4);

    // Warm filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    // Volume envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  /**
   * CONGRATULATIONS / VICTORY FANFARE
   * Triumphant multi-chord fanfare + celebratory bell chimes
   */
  playCongratulations() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Fanfare melodic sequence: (G4, C5, E5, G5, high C6 fanfare flourish)
    const melody = [
      { f: 392.00, t: 0.00, d: 0.15 }, // G4
      { f: 523.25, t: 0.16, d: 0.15 }, // C5
      { f: 659.25, t: 0.32, d: 0.15 }, // E5
      { f: 783.99, t: 0.48, d: 0.30 }, // G5
      { f: 659.25, t: 0.80, d: 0.15 }, // E5
      { f: 783.99, t: 0.96, d: 0.15 }, // G5
      { f: 1046.50, t: 1.12, d: 0.70 } // C6 (grand finish)
    ];

    melody.forEach(item => {
      const startTime = now + item.t;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + item.d + 0.05);
    });

    // Layer 2: Sparkling victory bells on the grand finish
    const bells = [1318.51, 1567.98, 2093.00]; // E6, G6, C7
    bells.forEach((freq, idx) => {
      const bellStart = now + 1.15 + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, bellStart);

      gain.gain.setValueAtTime(0, bellStart);
      gain.gain.linearRampToValueAtTime(0.2, bellStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, bellStart + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(bellStart);
      osc.stop(bellStart + 0.62);
    });
  }

  /**
   * Bubble Pop sound for button taps
   */
  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  /**
   * Star collection twinkle sound
   */
  playStarCollect() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    [880, 1174.66, 1760].forEach((f, i) => {
      const st = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0, st);
      gain.gain.linearRampToValueAtTime(0.2, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(st);
      osc.stop(st + 0.26);
    });
  }

  /**
   * Text to speech narration with friendly girl voice
   */
  speak(text) {
    if (!this.voiceEnabled || !this.speechSynth) return;
    try {
      this.speechSynth.cancel(); // Stop any pending speech
      if (!this.preferredVoice) this.initVoice();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      utterance.rate = 0.95; // Lively, clear pace for kids
      utterance.pitch = 1.35; // Cheerful girl-pitch
      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
}

// Global sound instance
const soundEngine = new SoundEngine();
