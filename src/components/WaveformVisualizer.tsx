import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../audioEngine';

interface WaveformVisualizerProps {
  mode: 'SCOPE' | 'SPECTRUM' | 'BOTH';
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  mode,
  isPlaying,
  currentStep,
  bpm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const timeData = new Uint8Array(512);
    const freqData = new Uint8Array(128);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear background with deep CRT obsidian
      ctx.fillStyle = '#07090E';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle 8-bit coordinate grid
      ctx.strokeStyle = '#141D2B';
      ctx.lineWidth = 1;
      const gridStep = 24;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center zero-crossing dashed line
      ctx.strokeStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const analyser = audioEngine.analyser;
      if (analyser) {
        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);
      } else {
        timeData.fill(128);
        freqData.fill(0);
      }

      // Draw Spectrum Bars if SPECTRUM or BOTH
      if (mode === 'SPECTRUM' || mode === 'BOTH') {
        const numBars = 32;
        const barWidth = Math.floor((width - numBars * 2) / numBars);
        for (let i = 0; i < numBars; i++) {
          const val = freqData[i * 2] || 0;
          const percent = val / 255;
          const barHeight = Math.floor(percent * (height - 16));
          // Quantize bar height to 4px blocks for 8-bit pixel aesthetic
          const quantizedHeight = Math.floor(barHeight / 4) * 4;

          if (quantizedHeight > 0) {
            const x = i * (barWidth + 2) + 4;
            const y = height - quantizedHeight - 4;

            ctx.fillStyle = mode === 'BOTH' ? 'rgba(6, 182, 212, 0.32)' : '#06B6D4';
            ctx.fillRect(x, y, barWidth, quantizedHeight);

            // Top peak cap block
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(x, Math.max(4, y - 4), barWidth, 3);
          }
        }
      }

      // Draw Stepped 8-Bit Oscilloscope Waveform if SCOPE or BOTH
      if (mode === 'SCOPE' || mode === 'BOTH') {
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const sliceWidth = width / 128;
        let x = 0;

        for (let i = 0; i < 128; i++) {
          const v = timeData[i * 2] / 128.0;
          // Quantize Y to 3px steps for crisp retro oscilloscope staircase look
          const rawY = (v * height) / 2;
          const y = Math.round(rawY / 3) * 3;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            // Staircase horizontal-then-vertical step
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode]);

  return (
    <div className="relative bg-[#07090E] border-2 border-[#334155] pixel-shadow overflow-hidden">
      <canvas
        ref={canvasRef}
        width={640}
        height={136}
        className="w-full h-[136px] block cursor-crosshair"
      />
      {/* Clean HUD overlay telemetry */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none text-xs font-mono-tabular text-[#94A3B8]">
        <span>
          {isPlaying ? '■ RUNNING' : '□ STANDBY'} · STEP {String(currentStep + 1).padStart(2, '0')}/16
        </span>
        <span>
          {bpm} BPM · 44.1 kHz 8-BIT DAC
        </span>
      </div>
    </div>
  );
};
