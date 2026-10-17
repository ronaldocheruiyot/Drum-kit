# BITPULSE-16: 8-Bit Chiptune Drum Machine & Synthesizer

**BITPULSE-16** is a browser-based 8-bit retro drum machine, 16-step pattern sequencer, polyphonic chiptune synthesizer, and live CRT waveform visualizer built entirely with React, TypeScript, Tailwind CSS, and the native **Web Audio API** (zero external audio samples required).

---

## Features

### 1. 12 Synthesized 8-Bit Drum & Arcade Voices
All percussion and arcade sound effects are synthesized in real time using Web Audio API oscillators, LFSR noise buffers, and biquad filters:
- **Drums**: `808 Sub Kick`, `Noise Snare`, `Closed Hat`, `Open Hat`
- **Percussion**: `8-Bit Clap`, `Square Tom`, `Dual-Oscillator 808 Cowbell`
- **Arcade SFX**: `Arcade Laser`, `1-Up Coin`, `Pixel Jump`, `Warp Powerup`, `Boss Boom`

### 2. 16-Step Pattern Matrix
- **3-State Step Pads**: Click once for a normal hit (`1x`), click again for an accented hit (`2x` velocity + subtle pitch boost), and click a third time to clear.
- **Accent Brush Mode**: Toggle one-click accent painting across steps.
- **Per-Track Controls**: Individual pitch tuning scrubbers (`50%` to `180%`), track mute toggles, Euclidean rhythm auto-fill generators, and single-track clear buttons.
- **Channel Category Filter**: Filter the matrix view by `ALL`, `DRUMS`, `PERC`, or `ARCADE` channels.
- **Built-in Chiptune Presets**: Switch instantaneously between *Mega Boss Stage*, *Outrun Highway*, *Acid Dungeon 303*, and *Star Warp Zone*.

### 3. Melodic Chiptune Synthesizer & 16-Step Synth Lane
- **8 Custom Synth Waveforms**:
  - `NES Pulse 25%` (custom Fourier `PeriodicWave`)
  - `Square 50%`
  - `Sawtooth`
  - `Triangle Bass`
  - `Acid 303 Sweep` (resonant low-pass envelope sweep)
  - `Vibrato Lead` (LFO pitch-modulated square lead)
  - `2-Op FM Bell` (FM metallic chime synthesis)
  - `Pure Sub Sine`
- **Chiptune Arpeggiator**: Switch between `OFF`, `UP`, `DOWN`, and `OCTAVE` arpeggiation modes.
- **Interactive 2-Octave Keyboard**: Play live via mouse or computer keyboard keys (`Z`–`M` for lower octave, `Q`–`I` for upper octave) and click steps in the `SYNTH SEQ LANE` to paint melodies.
- **ADSR & Resonant Filter Controls**: Adjust Filter Cutoff (`Hz`), Resonance (`Q`), Attack (`ms`), Release (`ms`), and Octave (`-1`, `0`, `+1`).

### 4. Live CRT Waveform Visualizer & Master FX Deck
- **Real-Time Audio Analyzer**: Renders a quantized 8-bit staircase oscilloscope (`SCOPE`), frequency bar analyzer (`SPECTRUM`), or combined view (`BOTH`) at 60 FPS.
- **Master Performance Controls**:
  - **Tempo Slider**: `60 BPM` – `220 BPM` + **Tap Tempo** button
  - **Swing Groove**: `0%` – `65%` 16th-note shuffle
  - **8-Bit Crush**: Real-time amplitude quantization waveshaper
  - **Tape Echo Mix**: Stereo feedback delay unit
  - **Master Low-Pass Filter**: `0.4 kHz` – `16.0 kHz`
  - **Hold: Beat Glitch**: Momentary 32nd-note beat repeat stutter effect
  - **Randomize Beat**: Smart musical beat and pentatonic bassline generator

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Start / Stop 16-Step Sequencer |
| `Z` `S` `X` `D` `C` `V` `G` `B` `H` `N` `J` `M` | Play C3 – B3 Synth Notes |
| `Q` `2` `W` `3` `E` `R` `5` `T` `6` `Y` `7` `U` `I` | Play C4 – C5 Synth Notes |
| `Shift + Click` (on Step Pad) | Toggle Step Accent (`▲`) |

---

## Getting Started Locally

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm**

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
npm install

# 3. Start the development server on port 3000
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

---

## Deploying to GitHub Pages

To host BITPULSE-16 directly on **GitHub Pages** so anyone can play it from your repository link:

1. Push your code to your GitHub repository (`main` branch).
2. Install the `gh-pages` package (or use a GitHub Actions workflow):
   ```bash
   npm install -D gh-pages
   ```
3. Add a `deploy` script in `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run `npm run deploy` and enable **GitHub Pages** under your repository's **Settings -> Pages**.

---

## License

Apache-2.0
