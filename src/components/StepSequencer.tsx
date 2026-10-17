import React, { useState } from 'react';
import {
  DRUM_TRACKS,
  DrumGrid,
  DrumId,
  StepValue,
  SynthStepNote,
  SYNTH_NOTES,
  audioEngine,
} from '../audioEngine';
import { Volume2, VolumeX, Sparkles, Trash2 } from 'lucide-react';

interface StepSequencerProps {
  drumGrid: DrumGrid;
  onToggleDrumStep: (drumId: DrumId, stepIdx: number, forceValue?: StepValue) => void;
  onClearTrack: (drumId: DrumId) => void;
  onFillEuclidean: (drumId: DrumId, pulses: number) => void;
  mutedTracks: Record<DrumId, boolean>;
  onToggleMute: (drumId: DrumId) => void;
  drumPitches: Record<DrumId, number>;
  onChangeDrumPitch: (drumId: DrumId, pitch: number) => void;
  synthSteps: SynthStepNote[];
  onChangeSynthStep: (stepIdx: number, noteIdx: SynthStepNote) => void;
  selectedNoteIdx: number;
  currentStep: number;
  isPlaying: boolean;
  categoryFilter: 'ALL' | 'DRUMS' | 'PERC' | 'ARCADE';
}

export const StepSequencer: React.FC<StepSequencerProps> = ({
  drumGrid,
  onToggleDrumStep,
  onClearTrack,
  onFillEuclidean,
  mutedTracks,
  onToggleMute,
  drumPitches,
  onChangeDrumPitch,
  synthSteps,
  onChangeSynthStep,
  selectedNoteIdx,
  currentStep,
  isPlaying,
  categoryFilter,
}) => {
  const [accentPaintMode, setAccentPaintMode] = useState(false);

  const visibleTracks = DRUM_TRACKS.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );

  const handleDrumPadClick = (
    e: React.MouseEvent,
    drumId: DrumId,
    stepIdx: number
  ) => {
    e.preventDefault();
    const currentVal = drumGrid[drumId][stepIdx];
    if (e.shiftKey || accentPaintMode) {
      const nextVal: StepValue = currentVal === 2 ? 0 : 2;
      onToggleDrumStep(drumId, stepIdx, nextVal);
      if (nextVal > 0) {
        audioEngine.triggerDrum(drumId, nextVal, drumPitches[drumId]);
      }
    } else {
      // Cycle 0 -> 1 -> 2 -> 0 on click for easy 1-button mouse access
      const nextVal: StepValue = currentVal === 0 ? 1 : currentVal === 1 ? 2 : 0;
      onToggleDrumStep(drumId, stepIdx, nextVal);
      if (nextVal > 0) {
        audioEngine.triggerDrum(drumId, nextVal, drumPitches[drumId]);
      }
    }
  };

  return (
    <div className="bg-[#111827] border-2 border-[#334155] p-4 pixel-shadow">
      {/* Sequencer Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 mb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold tracking-wider text-[#F1F5F9]">
            16-Step Pattern Matrix
          </h2>
          <span className="text-xs text-[#94A3B8] font-mono-tabular">
            Click: Normal (1x) · Click Again: Accent (2x) · 3rd Click: Off
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAccentPaintMode(!accentPaintMode)}
            className={`px-3 py-1.5 text-xs font-semibold border-2 transition-transform whitespace-nowrap shrink-0 pixel-button ${
              accentPaintMode
                ? 'bg-[#F59E0B] text-[#0B0E17] border-[#F59E0B]'
                : 'bg-[#1E293B] text-[#F1F5F9] border-[#334155] hover:border-[#94A3B8]'
            }`}
          >
            {accentPaintMode ? 'Accent Brush: Active' : 'Accent Brush: Off'}
          </button>
        </div>
      </div>

      {/* Step Numbers Header Row */}
      <div className="grid grid-cols-[190px_1fr] gap-3 items-center mb-2">
        <div className="text-xs font-mono-tabular text-[#94A3B8] flex items-center justify-between pr-2">
          <span>CHANNEL / TUNE</span>
          <span>MUTE / FILL</span>
        </div>
        <div className="grid grid-cols-16 gap-1.5">
          {Array.from({ length: 16 }).map((_, idx) => {
            const isBeatHead = idx % 4 === 0;
            const isCurrent = isPlaying && currentStep === idx;
            return (
              <div
                key={idx}
                className={`text-center py-1 text-xs font-mono-tabular border ${
                  isCurrent
                    ? 'bg-[#F59E0B] text-[#0B0E17] font-bold border-[#F59E0B]'
                    : isBeatHead
                      ? 'bg-[#1E293B] text-[#F1F5F9] border-[#334155]'
                      : 'bg-[#0B0E17] text-[#64748B] border-[#1E293B]'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drum Tracks Rows */}
      <div className="space-y-1.5">
        {visibleTracks.map((track) => {
          const steps = drumGrid[track.id];
          const isMuted = mutedTracks[track.id];
          const pitch = drumPitches[track.id];

          return (
            <div
              key={track.id}
              className={`grid grid-cols-[190px_1fr] gap-3 items-center py-1 px-1.5 border ${
                isMuted
                  ? 'bg-[#0B0E17]/60 border-[#1E293B] opacity-60'
                  : 'bg-[#0B0E17] border-[#1E293B]'
              }`}
            >
              {/* Left Track Controls */}
              <div className="flex items-center justify-between gap-1.5 pr-1">
                <button
                  type="button"
                  onClick={() => audioEngine.triggerDrum(track.id, 2, pitch)}
                  title={`Audition ${track.name}`}
                  className="text-left group flex items-center gap-1.5 min-w-[78px] whitespace-nowrap shrink-0"
                >
                  <span
                    className="w-2 h-4 inline-block shrink-0"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className="text-xs font-mono-tabular font-bold text-[#F1F5F9] group-hover:text-[#10B981] transition-colors">
                    {track.shortName}
                  </span>
                </button>

                {/* Mini Pitch Scrubber */}
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={pitch}
                  title={`Tune ${track.name}: ${Math.round(pitch * 100)}%`}
                  onChange={(e) =>
                    onChangeDrumPitch(track.id, parseFloat(e.target.value))
                  }
                  className="w-12 pixel-slider"
                />

                {/* Mute, Euclidean Auto-Fill, Clear */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleMute(track.id)}
                    title={isMuted ? 'Unmute Track' : 'Mute Track'}
                    className={`p-1 border ${
                      isMuted
                        ? 'bg-[#EF4444] text-[#0B0E17] border-[#EF4444]'
                        : 'bg-[#1E293B] text-[#94A3B8] border-[#334155] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const pulses =
                        track.id === 'kick' || track.id === 'snare'
                          ? 4
                          : track.id.startsWith('hat')
                            ? 11
                            : 5;
                      onFillEuclidean(track.id, pulses);
                    }}
                    title="Generate Euclidean Rhythm on Track"
                    className="p-1 bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:text-[#10B981] hover:border-[#10B981]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onClearTrack(track.id)}
                    title="Clear Track"
                    className="p-1 bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:text-[#EF4444]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 16 Step Pads */}
              <div className="grid grid-cols-16 gap-1.5">
                {steps.map((val, stepIdx) => {
                  const isCurrent = isPlaying && currentStep === stepIdx;
                  const isQuarterBeat = Math.floor(stepIdx / 4) % 2 === 0;

                  let bgClass = isQuarterBeat ? 'bg-[#162032]' : 'bg-[#111827]';
                  let borderClass = 'border-[#334155]';

                  if (val === 1) {
                    bgClass =
                      track.category === 'DRUMS'
                        ? 'bg-[#10B981]'
                        : track.category === 'PERC'
                          ? 'bg-[#06B6D4]'
                          : 'bg-[#F59E0B]';
                    borderClass = 'border-[#F1F5F9]';
                  } else if (val === 2) {
                    bgClass = 'bg-[#F59E0B]';
                    borderClass = 'border-[#FFFFFF]';
                  }

                  if (isCurrent) {
                    borderClass = 'border-[#F59E0B] ring-2 ring-[#F59E0B]';
                  }

                  return (
                    <button
                      key={stepIdx}
                      type="button"
                      onClick={(e) => handleDrumPadClick(e, track.id, stepIdx)}
                      aria-label={`${track.name} Step ${stepIdx + 1}`}
                      className={`h-8 border-2 transition-transform relative flex items-center justify-center ${bgClass} ${borderClass} hover:border-[#F1F5F9]`}
                    >
                      {val === 2 && (
                        <span className="text-[10px] font-mono-tabular font-bold text-[#0B0E17] leading-none">
                          ▲
                        </span>
                      )}
                      {val === 1 && (
                        <span className="w-2 h-2 bg-[#0B0E17]/60 block" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Melodic Synth 16-Step Sequencer Lane */}
      <div className="mt-4 pt-3 border-t-2 border-[#334155]">
        <div className="grid grid-cols-[190px_1fr] gap-3 items-center py-1.5 px-1.5 bg-[#0B0E17] border border-[#06B6D4]/50">
          <div className="flex items-center justify-between pr-1">
            <div>
              <div className="text-xs font-mono-tabular font-bold text-[#06B6D4]">
                SYNTH SEQ LANE
              </div>
              <div className="text-[11px] font-mono-tabular text-[#94A3B8]">
                Paint: {SYNTH_NOTES[selectedNoteIdx]?.name || 'C4'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                for (let i = 0; i < 16; i++) onChangeSynthStep(i, null);
              }}
              className="px-2 py-1 text-xs font-mono-tabular bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:text-[#EF4444] whitespace-nowrap shrink-0"
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-16 gap-1.5">
            {synthSteps.map((noteIdx, stepIdx) => {
              const isCurrent = isPlaying && currentStep === stepIdx;
              const hasNote = noteIdx !== null && SYNTH_NOTES[noteIdx] !== undefined;
              const noteName = hasNote ? SYNTH_NOTES[noteIdx!].name : '—';

              return (
                <button
                  key={stepIdx}
                  type="button"
                  onClick={() => {
                    if (noteIdx === selectedNoteIdx) {
                      onChangeSynthStep(stepIdx, null);
                    } else {
                      onChangeSynthStep(stepIdx, selectedNoteIdx);
                    }
                  }}
                  title="Click to assign selected keyboard note, click again to clear"
                  className={`h-9 border-2 font-mono-tabular text-[11px] font-bold transition-colors flex items-center justify-center ${
                    hasNote
                      ? 'bg-[#06B6D4] text-[#0B0E17] border-[#F1F5F9]'
                      : 'bg-[#162032] text-[#64748B] border-[#334155] hover:border-[#06B6D4]'
                  } ${isCurrent ? 'ring-2 ring-[#F59E0B]' : ''}`}
                >
                  {noteName}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
