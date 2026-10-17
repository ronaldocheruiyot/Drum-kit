/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  DRUM_TRACKS,
  DrumGrid,
  DrumId,
  MasterFX,
  PRESET_PATTERNS,
  SYNTH_NOTES,
  StepValue,
  SynthPatch,
  SynthStepNote,
  audioEngine,
  createEmptyDrumGrid,
} from './audioEngine';
import { WaveformVisualizer } from './components/WaveformVisualizer';
import { StepSequencer } from './components/StepSequencer';
import { SynthConsole } from './components/SynthConsole';
import { Play, Square, Shuffle, RotateCcw } from 'lucide-react';

export default function App() {
  // Sequencer & Pattern State
  const [activePresetId, setActivePresetId] = useState<string>(PRESET_PATTERNS[0].id);
  const [bpm, setBpm] = useState<number>(PRESET_PATTERNS[0].bpm);
  const [swing, setSwing] = useState<number>(PRESET_PATTERNS[0].swing);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [drumGrid, setDrumGrid] = useState<DrumGrid>(() => ({
    ...PRESET_PATTERNS[0].drums,
  }));

  const [mutedTracks, setMutedTracks] = useState<Record<DrumId, boolean>>(() => {
    const init = {} as Record<DrumId, boolean>;
    DRUM_TRACKS.forEach((t) => (init[t.id] = false));
    return init;
  });

  const [drumPitches, setDrumPitches] = useState<Record<DrumId, number>>(() => {
    const init = {} as Record<DrumId, number>;
    DRUM_TRACKS.forEach((t) => (init[t.id] = t.defaultPitch));
    return init;
  });

  const [synthSteps, setSynthSteps] = useState<SynthStepNote[]>(() => [
    ...PRESET_PATTERNS[0].synthSteps,
  ]);

  const [selectedNoteIdx, setSelectedNoteIdx] = useState<number>(12); // C4

  const [synthPatch, setSynthPatch] = useState<SynthPatch>({
    wave: 'pulse25',
    octave: 0,
    attack: 0.01,
    decay: 0.15,
    sustain: 0.45,
    release: 0.14,
    cutoff: 4200,
    resonance: 4.5,
    arpMode: 'OCTAVE',
  });

  const [masterFX, setMasterFX] = useState<MasterFX>({
    volume: 0.82,
    bitcrush: 0.18,
    delayTime: 0.22,
    delayFeedback: 0.32,
    delayMix: 0.18,
    filterCutoff: 14000,
  });

  const [visualizerMode, setVisualizerMode] = useState<'SCOPE' | 'SPECTRUM' | 'BOTH'>('BOTH');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'DRUMS' | 'PERC' | 'ARCADE'>('ALL');
  const [stutterHold, setStutterHold] = useState<boolean>(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  // Refs for accurate real-time sequencer access without re-binding timers
  const drumGridRef = useRef(drumGrid);
  drumGridRef.current = drumGrid;

  const mutedTracksRef = useRef(mutedTracks);
  mutedTracksRef.current = mutedTracks;

  const drumPitchesRef = useRef(drumPitches);
  drumPitchesRef.current = drumPitches;

  const synthStepsRef = useRef(synthSteps);
  synthStepsRef.current = synthSteps;

  const synthPatchRef = useRef(synthPatch);
  synthPatchRef.current = synthPatch;

  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  const swingRef = useRef(swing);
  swingRef.current = swing;

  const stutterRef = useRef(stutterHold);
  stutterRef.current = stutterHold;

  const stepIndexRef = useRef(0);

  // Sync Master FX to Web Audio Engine
  useEffect(() => {
    audioEngine.applyMasterFX(masterFX);
  }, [masterFX]);

  // Trigger a single step's sounds
  const triggerStepAudio = useCallback((stepIdx: number) => {
    const grid = drumGridRef.current;
    const muted = mutedTracksRef.current;
    const pitches = drumPitchesRef.current;

    DRUM_TRACKS.forEach((track) => {
      if (muted[track.id]) return;
      const val = grid[track.id][stepIdx];
      if (val > 0) {
        audioEngine.triggerDrum(track.id, val, pitches[track.id]);
      }
    });

    const noteIdx = synthStepsRef.current[stepIdx];
    if (noteIdx !== null && SYNTH_NOTES[noteIdx]) {
      const stepDuration = 60 / bpmRef.current / 4;
      audioEngine.triggerSynthNote(
        SYNTH_NOTES[noteIdx].freq,
        synthPatchRef.current,
        stepDuration * 0.9
      );
    }
  }, []);

  // Main 16-Step Sequencer Clock Loop with Swing & Stutter support
  useEffect(() => {
    if (!isPlaying) return;

    let timerId: number;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const step = stepIndexRef.current;
      setCurrentStep(step);
      triggerStepAudio(step);

      // Calculate duration until next 16th note with swing on odd steps
      const baseStepMs = (60 / bpmRef.current / 4) * 1000;
      const swingFactor = (swingRef.current / 100) * 0.45;
      const isOddStep = step % 2 === 1;
      const stepMs = isOddStep
        ? baseStepMs * (1 - swingFactor)
        : baseStepMs * (1 + swingFactor);

      // If Beat Repeat Stutter is held, re-trigger current step at 32nd-note rate
      if (!stutterRef.current) {
        stepIndexRef.current = (step + 1) % 16;
      }

      timerId = window.setTimeout(tick, stutterRef.current ? baseStepMs * 0.5 : stepMs);
    };

    timerId = window.setTimeout(tick, 10);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [isPlaying, triggerStepAudio]);

  // Spacebar shortcut for Play/Stop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLButtonElement)
      ) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const togglePlay = () => {
    audioEngine.init();
    audioEngine.applyMasterFX(masterFX);
    if (!isPlaying) {
      stepIndexRef.current = 0;
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_PATTERNS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setBpm(preset.bpm);
    setSwing(preset.swing);
    // Deep copy drum steps
    const nextDrums = createEmptyDrumGrid();
    (Object.keys(preset.drums) as DrumId[]).forEach((k) => {
      nextDrums[k] = [...preset.drums[k]];
    });
    setDrumGrid(nextDrums);
    setSynthSteps([...preset.synthSteps]);
    setSynthPatch((prev) => ({ ...prev, ...preset.synthPatch }));
  };

  const handleToggleDrumStep = (
    drumId: DrumId,
    stepIdx: number,
    forceValue?: StepValue
  ) => {
    setDrumGrid((prev) => {
      const row = [...prev[drumId]];
      row[stepIdx] =
        forceValue !== undefined
          ? forceValue
          : ((row[stepIdx] + 1) % 3 as StepValue);
      return { ...prev, [drumId]: row };
    });
  };

  const handleClearTrack = (drumId: DrumId) => {
    setDrumGrid((prev) => ({
      ...prev,
      [drumId]: Array(16).fill(0) as StepValue[],
    }));
  };

  const handleFillEuclidean = (drumId: DrumId, pulses: number) => {
    const row: StepValue[] = Array(16).fill(0);
    for (let i = 0; i < 16; i++) {
      if ((i * pulses) % 16 < pulses) {
        row[i] = i % 4 === 0 ? 2 : 1;
      }
    }
    setDrumGrid((prev) => ({ ...prev, [drumId]: row }));
    audioEngine.triggerDrum(drumId, 2, drumPitches[drumId]);
  };

  const handleRandomizeBeat = () => {
    audioEngine.init();
    const nextGrid = createEmptyDrumGrid();

    // Musical smart randomization
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0 || (i % 2 === 0 && Math.random() < 0.35)) {
        nextGrid.kick[i] = i % 4 === 0 ? 2 : 1;
      }
      if (i === 4 || i === 12 || (Math.random() < 0.15 && i % 2 === 1)) {
        nextGrid.snare[i] = i === 4 || i === 12 ? 2 : 1;
      }
      if (Math.random() < 0.72) {
        nextGrid.hatClosed[i] = i % 4 === 2 ? 2 : 1;
      }
      if (i === 14 && Math.random() < 0.7) {
        nextGrid.hatOpen[i] = 2;
      }
      if (Math.random() < 0.18) {
        nextGrid.tom[i] = 1;
      }
      if (Math.random() < 0.12) {
        nextGrid.cowbell[i] = 1;
      }
      if (i === 15 && Math.random() < 0.65) {
        nextGrid.laser[i] = 2;
      }
      if (i === 0 && Math.random() < 0.5) {
        nextGrid.coin[i] = 1;
      }
      if (i === 7 && Math.random() < 0.45) {
        nextGrid.jump[i] = 1;
      }
    }

    // Pentatonic C minor scale indices in SYNTH_NOTES
    const scaleIndices = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24];
    const nextSynth: SynthStepNote[] = Array.from({ length: 16 }, (_, idx) => {
      if (idx % 2 === 0 || Math.random() < 0.55) {
        return scaleIndices[Math.floor(Math.random() * scaleIndices.length)];
      }
      return null;
    });

    setDrumGrid(nextGrid);
    setSynthSteps(nextSynth);
  };

  const handleClearAll = () => {
    setDrumGrid(createEmptyDrumGrid());
    setSynthSteps(Array(16).fill(null));
  };

  const handleTapTempo = () => {
    const now = performance.now();
    const recent = [...tapTimes.filter((t) => now - t < 2500), now];
    setTapTimes(recent);
    if (recent.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i] - recent[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.max(60, Math.min(220, Math.round(60000 / avgMs)));
      setBpm(calculatedBpm);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] text-[#F1F5F9] flex flex-col">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#111827] border-b-2 border-[#334155]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-pixel text-sm sm:text-base tracking-wider text-[#10B981] whitespace-nowrap shrink-0"
        >
          BITPULSE-16
        </a>

        {/* Zone 2: 4 concise single-line preset navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono-tabular font-semibold text-[#94A3B8]">
          {PRESET_PATTERNS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset.id)}
              className={`hover:text-[#F1F5F9] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activePresetId === preset.id ? 'text-[#10B981] underline' : ''
              }`}
            >
              {preset.name}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            className={`px-4 py-2 text-xs font-mono-tabular font-bold border-2 transition-transform whitespace-nowrap shrink-0 flex items-center gap-2 pixel-button ${
              isPlaying
                ? 'bg-[#EF4444] text-[#0B0E17] border-[#FFFFFF]'
                : 'bg-[#10B981] text-[#0B0E17] border-[#FFFFFF]'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                Stop Sequencer
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Sequencer
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main 1440px Workstation Container */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-4 space-y-4 flex-1">
        {/* Top Deck: Live CRT Waveform Visualizer + Tempo, Swing & Master FX */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left 5 Cols: Live Oscilloscope & Spectrum Analyzer */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#111827] border-2 border-[#334155] p-3.5 pixel-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider text-[#F1F5F9]">
                Live CRT Audio Analyzer
              </span>
              <div className="flex items-center gap-1">
                {(['SCOPE', 'SPECTRUM', 'BOTH'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setVisualizerMode(m)}
                    className={`px-2 py-0.5 text-[11px] font-mono-tabular font-semibold border whitespace-nowrap shrink-0 ${
                      visualizerMode === m
                        ? 'bg-[#10B981] text-[#0B0E17] border-[#F1F5F9]'
                        : 'bg-[#0B0E17] text-[#94A3B8] border-[#334155] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <WaveformVisualizer
              mode={visualizerMode}
              isPlaying={isPlaying}
              currentStep={currentStep}
              bpm={bpm}
            />
          </div>

          {/* Right 7 Cols: Tempo Slider, Swing, Bitcrusher, Delay & Pattern Actions */}
          <div className="lg:col-span-7 bg-[#111827] border-2 border-[#334155] p-4 pixel-shadow flex flex-col justify-between gap-3">
            {/* Row 1: Transport, Pattern Bank, Randomizer, Stutter */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRandomizeBeat}
                  className="px-3 py-1.5 text-xs font-mono-tabular font-bold bg-[#06B6D4] text-[#0B0E17] border-2 border-[#F1F5F9] flex items-center gap-1.5 whitespace-nowrap shrink-0 pixel-button"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Randomize Beat
                </button>

                <button
                  type="button"
                  onMouseDown={() => setStutterHold(true)}
                  onMouseUp={() => setStutterHold(false)}
                  onMouseLeave={() => setStutterHold(false)}
                  onTouchStart={() => setStutterHold(true)}
                  onTouchEnd={() => setStutterHold(false)}
                  className={`px-3 py-1.5 text-xs font-mono-tabular font-bold border-2 whitespace-nowrap shrink-0 pixel-button ${
                    stutterHold
                      ? 'bg-[#F59E0B] text-[#0B0E17] border-[#FFFFFF]'
                      : 'bg-[#1E293B] text-[#F1F5F9] border-[#334155] hover:border-[#F59E0B]'
                  }`}
                >
                  Hold: Beat Glitch
                </button>

                <button
                  type="button"
                  onClick={handleTapTempo}
                  className="px-3 py-1.5 text-xs font-mono-tabular font-semibold bg-[#1E293B] text-[#F1F5F9] border-2 border-[#334155] hover:border-[#10B981] whitespace-nowrap shrink-0 pixel-button"
                >
                  Tap Tempo
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-xs font-mono-tabular font-semibold bg-[#1E293B] text-[#94A3B8] border-2 border-[#334155] hover:text-[#EF4444] hover:border-[#EF4444] flex items-center gap-1 whitespace-nowrap shrink-0 pixel-button"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

              {/* Channel Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#0B0E17] p-1 border border-[#334155]">
                {(['ALL', 'DRUMS', 'PERC', 'ARCADE'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-xs font-mono-tabular font-semibold whitespace-nowrap shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-[#10B981] text-[#0B0E17]'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Primary Sliders (Tempo BPM, Swing, 8-Bit Crush, Echo Mix, Master Filter, Volume) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3 text-xs font-mono-tabular">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8]">TEMPO SLIDER</span>
                  <span className="text-[#10B981] font-bold">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="1"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                  className="w-full pixel-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8]">SWING GROOVE</span>
                  <span className="text-[#10B981] font-bold">{swing}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="65"
                  step="1"
                  value={swing}
                  onChange={(e) => setSwing(parseInt(e.target.value, 10))}
                  className="w-full pixel-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8]">8-BIT CRUSH</span>
                  <span className="text-[#F59E0B] font-bold">
                    {Math.round(masterFX.bitcrush * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.95"
                  step="0.05"
                  value={masterFX.bitcrush}
                  onChange={(e) =>
                    setMasterFX((prev) => ({
                      ...prev,
                      bitcrush: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full pixel-slider amber-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8]">TAPE ECHO MIX</span>
                  <span className="text-[#06B6D4] font-bold">
                    {Math.round(masterFX.delayMix * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.65"
                  step="0.05"
                  value={masterFX.delayMix}
                  onChange={(e) =>
                    setMasterFX((prev) => ({
                      ...prev,
                      delayMix: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full pixel-slider cyan-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8]">MASTER LP FILTER</span>
                  <span className="text-[#06B6D4] font-bold">
                    {(masterFX.filterCutoff / 1000).toFixed(1)} kHz
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="16000"
                  step="200"
                  value={masterFX.filterCutoff}
                  onChange={(e) =>
                    setMasterFX((prev) => ({
                      ...prev,
                      filterCutoff: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full pixel-slider cyan-slider"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8]">MASTER GAIN</span>
                  <span className="text-[#10B981] font-bold">
                    {Math.round(masterFX.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={masterFX.volume}
                  onChange={(e) =>
                    setMasterFX((prev) => ({
                      ...prev,
                      volume: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full pixel-slider"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Middle Deck: 16-Step Drum & Synth Matrix */}
        <section>
          <StepSequencer
            drumGrid={drumGrid}
            onToggleDrumStep={handleToggleDrumStep}
            onClearTrack={handleClearTrack}
            onFillEuclidean={handleFillEuclidean}
            mutedTracks={mutedTracks}
            onToggleMute={(id) =>
              setMutedTracks((prev) => ({ ...prev, [id]: !prev[id] }))
            }
            drumPitches={drumPitches}
            onChangeDrumPitch={(id, pitch) =>
              setDrumPitches((prev) => ({ ...prev, [id]: pitch }))
            }
            synthSteps={synthSteps}
            onChangeSynthStep={(stepIdx, noteIdx) =>
              setSynthSteps((prev) => {
                const next = [...prev];
                next[stepIdx] = noteIdx;
                return next;
              })
            }
            selectedNoteIdx={selectedNoteIdx}
            currentStep={currentStep}
            isPlaying={isPlaying}
            categoryFilter={categoryFilter}
          />
        </section>

        {/* Bottom Deck: Chiptune Synth Keyboard, ADSR/Filter & 12-Voice Soundboard */}
        <section>
          <SynthConsole
            patch={synthPatch}
            onChangePatch={(updated) =>
              setSynthPatch((prev) => ({ ...prev, ...updated }))
            }
            selectedNoteIdx={selectedNoteIdx}
            onSelectNoteIdx={setSelectedNoteIdx}
            drumPitches={drumPitches}
          />
        </section>
      </main>
    </div>
  );
}

