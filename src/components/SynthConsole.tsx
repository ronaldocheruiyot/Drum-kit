import React, { useEffect, useState } from 'react';
import {
  DRUM_TRACKS,
  DrumId,
  SYNTH_NOTES,
  SynthPatch,
  SynthWaveType,
  audioEngine,
} from '../audioEngine';

interface SynthConsoleProps {
  patch: SynthPatch;
  onChangePatch: (updated: Partial<SynthPatch>) => void;
  selectedNoteIdx: number;
  onSelectNoteIdx: (idx: number) => void;
  drumPitches: Record<DrumId, number>;
}

const WAVE_OPTIONS: { id: SynthWaveType; label: string }[] = [
  { id: 'pulse25', label: 'NES Pulse 25%' },
  { id: 'square', label: 'Square 50%' },
  { id: 'sawtooth', label: 'Sawtooth' },
  { id: 'triangle', label: 'Triangle Bass' },
  { id: 'acidBass', label: 'Acid 303 Sweep' },
  { id: 'chipLead', label: 'Vibrato Lead' },
  { id: 'fmBell', label: '2-Op FM Bell' },
  { id: 'sine', label: 'Pure Sub Sine' },
];

export const SynthConsole: React.FC<SynthConsoleProps> = ({
  patch,
  onChangePatch,
  selectedNoteIdx,
  onSelectNoteIdx,
  drumPitches,
}) => {
  const [activeKeyIdx, setActiveKeyIdx] = useState<number | null>(null);
  const [activePadId, setActivePadId] = useState<DrumId | null>(null);

  const playNote = (idx: number) => {
    const note = SYNTH_NOTES[idx];
    if (!note) return;
    onSelectNoteIdx(idx);
    setActiveKeyIdx(idx);
    audioEngine.triggerSynthNote(note.freq, patch, 0.28);
    window.setTimeout(() => {
      setActiveKeyIdx((prev) => (prev === idx ? null : prev));
    }, 180);
  };

  const triggerArcadePad = (id: DrumId) => {
    setActivePadId(id);
    audioEngine.triggerDrum(id, 2, drumPitches[id] ?? 1.0);
    window.setTimeout(() => {
      setActivePadId((prev) => (prev === id ? null : prev));
    }, 140);
  };

  // Keyboard listener for playing notes & arcade SFX
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.repeat ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const key = e.key.toUpperCase();
      const noteIdx = SYNTH_NOTES.findIndex((n) => n.keyShortcut === key);
      if (noteIdx !== -1) {
        playNote(noteIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [patch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left 7 Cols: Polyphonic 2-Octave Keyboard & Waveform/Arp Selector */}
      <div className="lg:col-span-7 bg-[#111827] border-2 border-[#334155] p-4 pixel-shadow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1E293B]">
            <div>
              <h3 className="text-sm font-bold tracking-wider text-[#F1F5F9]">
                Chiptune Synthesizer & Note Painter
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono-tabular">
                Click or press keyboard keys (Z-M / Q-I) to play & select note for sequencer
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {(['OFF', 'UP', 'DOWN', 'OCTAVE'] as const).map((arp) => (
                <button
                  key={arp}
                  type="button"
                  onClick={() => onChangePatch({ arpMode: arp })}
                  className={`px-2.5 py-1 text-xs font-mono-tabular font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                    patch.arpMode === arp
                      ? 'bg-[#06B6D4] text-[#0B0E17] border-[#F1F5F9]'
                      : 'bg-[#0B0E17] text-[#94A3B8] border-[#334155] hover:text-[#F1F5F9]'
                  }`}
                >
                  ARP: {arp}
                </button>
              ))}
            </div>
          </div>

          {/* 8 Synth Waveforms Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {WAVE_OPTIONS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  onChangePatch({ wave: w.id });
                  const note = SYNTH_NOTES[selectedNoteIdx] || SYNTH_NOTES[12];
                  audioEngine.triggerSynthNote(
                    note.freq,
                    { ...patch, wave: w.id },
                    0.22
                  );
                }}
                className={`px-2.5 py-1.5 text-xs font-mono-tabular font-semibold border-2 text-left transition-transform whitespace-nowrap truncate pixel-button ${
                  patch.wave === w.id
                    ? 'bg-[#10B981] text-[#0B0E17] border-[#F1F5F9]'
                    : 'bg-[#0B0E17] text-[#F1F5F9] border-[#334155] hover:border-[#10B981]'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 8-Bit 2-Octave Keyboard */}
        <div className="bg-[#07090E] p-3 border-2 border-[#1E293B]">
          <div className="grid grid-cols-13 sm:grid-cols-25 gap-1">
            {SYNTH_NOTES.map((note, idx) => {
              const isSelected = selectedNoteIdx === idx;
              const isPlayingNow = activeKeyIdx === idx;

              return (
                <button
                  key={note.name}
                  type="button"
                  onClick={() => playNote(idx)}
                  className={`h-24 border-2 flex flex-col items-center justify-between py-1.5 px-0.5 transition-transform pixel-button ${
                    isPlayingNow
                      ? 'bg-[#F59E0B] text-[#0B0E17] border-[#FFFFFF]'
                      : isSelected
                        ? 'bg-[#06B6D4] text-[#0B0E17] border-[#FFFFFF]'
                        : note.isBlack
                          ? 'bg-[#111827] text-[#94A3B8] border-[#334155] hover:border-[#06B6D4]'
                          : 'bg-[#E2E8F0] text-[#0B0E17] border-[#94A3B8] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <span className="text-[10px] font-mono-tabular font-bold">
                    {note.keyShortcut}
                  </span>
                  <span className="text-[10px] font-mono-tabular font-semibold tracking-tighter">
                    {note.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right 5 Cols: Envelope / Filter Sliders + Live Arcade Soundboard */}
      <div className="lg:col-span-5 bg-[#111827] border-2 border-[#334155] p-4 pixel-shadow flex flex-col justify-between gap-4">
        {/* Synth ADSR & Filter Controls */}
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E293B]">
            <h3 className="text-sm font-bold tracking-wider text-[#F1F5F9]">
              Synth Envelope & Filter
            </h3>
            <div className="flex items-center gap-1.5 font-mono-tabular text-xs">
              <span className="text-[#94A3B8]">OCTAVE:</span>
              {[-1, 0, 1].map((oct) => (
                <button
                  key={oct}
                  type="button"
                  onClick={() => onChangePatch({ octave: oct })}
                  className={`px-2 py-0.5 border text-xs ${
                    patch.octave === oct
                      ? 'bg-[#10B981] text-[#0B0E17] border-[#F1F5F9] font-bold'
                      : 'bg-[#0B0E17] text-[#94A3B8] border-[#334155]'
                  }`}
                >
                  {oct > 0 ? `+${oct}` : oct}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-mono-tabular">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#94A3B8]">CUTOFF</span>
                <span className="text-[#06B6D4]">{Math.round(patch.cutoff)} Hz</span>
              </div>
              <input
                type="range"
                min="250"
                max="10000"
                step="50"
                value={patch.cutoff}
                onChange={(e) => onChangePatch({ cutoff: parseFloat(e.target.value) })}
                className="w-full pixel-slider cyan-slider"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#94A3B8]">RESONANCE</span>
                <span className="text-[#06B6D4]">{patch.resonance.toFixed(1)} Q</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14"
                step="0.5"
                value={patch.resonance}
                onChange={(e) => onChangePatch({ resonance: parseFloat(e.target.value) })}
                className="w-full pixel-slider cyan-slider"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#94A3B8]">ATTACK</span>
                <span className="text-[#10B981]">{Math.round(patch.attack * 1000)} ms</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.35"
                step="0.005"
                value={patch.attack}
                onChange={(e) => onChangePatch({ attack: parseFloat(e.target.value) })}
                className="w-full pixel-slider"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#94A3B8]">RELEASE</span>
                <span className="text-[#10B981]">{Math.round(patch.release * 1000)} ms</span>
              </div>
              <input
                type="range"
                min="0.03"
                max="0.9"
                step="0.02"
                value={patch.release}
                onChange={(e) => onChangePatch({ release: parseFloat(e.target.value) })}
                className="w-full pixel-slider"
              />
            </div>
          </div>
        </div>

        {/* Instant 12-Pad Drum & Arcade Trigger Matrix */}
        <div className="pt-2 border-t border-[#1E293B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#F1F5F9]">
              Live Soundboard Trigger Pads (12 Voices)
            </span>
            <span className="text-[11px] font-mono-tabular text-[#94A3B8]">
              Instant Audition
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {DRUM_TRACKS.map((t) => {
              const isTriggered = activePadId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => triggerArcadePad(t.id)}
                  className={`py-2 px-2 border-2 font-mono-tabular text-xs font-bold transition-transform whitespace-nowrap truncate pixel-button ${
                    isTriggered
                      ? 'bg-[#F59E0B] text-[#0B0E17] border-[#FFFFFF]'
                      : 'bg-[#0B0E17] text-[#F1F5F9] border-[#334155] hover:border-[#10B981]'
                  }`}
                >
                  {t.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
