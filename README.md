# BITPULSE-16: 8-Bit Chiptune Drum Machine & Synthesizer

**BITPULSE-16** is a browser-based 8-bit retro drum machine, 16-step pattern sequencer, polyphonic chiptune synthesizer, and live CRT waveform visualizer built with React, TypeScript, Tailwind CSS, and the native **Web Audio API** (zero external audio files or API keys required).

---

## Live Demo & 1-Click Vercel Deployment

Anyone can play the complete interactive version directly in their browser:

- **Shared Cloud Preview URL (Live Now)**: [https://ais-pre-tepdboi2sanmdnca6y7dmw-622718813084.europe-west2.run.app](https://ais-pre-tepdboi2sanmdnca6y7dmw-622718813084.europe-west2.run.app)
- **GitHub Pages Live URL** *(once pushed to your GitHub)*: `https://<your-github-username>.github.io/<your-repo-name>/`

### Deploy Your Own Copy to Vercel in 1 Click
Once you export this project to your GitHub repository, click the button below (or replace the `repository-url` parameter with your repo URL) to deploy and claim it on your Vercel account in 30 seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## How to Use BITPULSE-16 (Step-by-Step User Guide)

### 1. Start the Beat & Switch Presets
- Click **`Start Sequencer`** in the top-right corner (or press the **`Spacebar`** on your keyboard) to start the 16-step loop.
- Click any of the 4 preset songs in the top navigation bar (**`Mega Boss Stage`**, **`Outrun Highway`**, **`Acid Dungeon 303`**, or **`Star Warp Zone`**) to load a full drum pattern, synth bassline, and custom patch.

### 2. Program the 16-Step Drum Matrix
- **3-State Step Pads**:
  - **1st Click**: Normal Hit (`1x` velocity)
  - **2nd Click**: Accented Hit (`▲` — louder `2x` velocity + slight pitch boost)
  - **3rd Click**: Off
- **Accent Brush**: Click **`Accent Brush: Off`** to toggle it to **`Active`**, allowing you to paint accented steps in a single click.
- **Channel Audition & Tuning**: Click any channel label on the left (`KICK`, `SNARE`, `LASER`, `COIN`, etc.) to preview the sound, and drag the mini slider next to it to tune its pitch (`50%` to `180%`).
- **Track Mute, Euclidean Auto-Fill & Clear**:
  - **Speaker Icon**: Mute or unmute individual tracks live.
  - **Sparkle Icon**: Automatically generate a mathematical **Euclidean rhythm** on that track.
  - **Trash Icon**: Clear that single track.
- **Category Filter**: Filter visible tracks using the **`ALL`**, **`DRUMS`**, **`PERC`**, or **`ARCADE`** buttons.

### 3. Play the Chiptune Synthesizer & Paint Melodies
- **Play Notes Live**: Click the 2-octave on-screen keyboard or press keys on your computer keyboard:
  - **Lower Octave (`C3` – `B3`)**: `Z` `S` `X` `D` `C` `V` `G` `B` `H` `N` `J` `M`
  - **Upper Octave (`C4` – `C5`)**: `Q` `2` `W` `3` `E` `R` `5` `T` `6` `Y` `7` `U` `I`
- **Program the Melodic Sequencer (`SYNTH SEQ LANE`)**:
  1. Click any key on the synth keyboard to select that note (shown under `Paint: <Note>`).
  2. Click any of the 16 boxes in the **`SYNTH SEQ LANE`** row at the bottom of the matrix to place that note on that step. Click the same step again to clear it.
- **8 Waveforms & Arpeggiator**:
  - Choose between `NES Pulse 25%`, `Square 50%`, `Sawtooth`, `Triangle Bass`, `Acid 303 Sweep`, `Vibrato Lead`, `2-Op FM Bell`, and `Pure Sub Sine`.
  - Toggle the Chiptune Arpeggiator between **`ARP: OFF`**, **`UP`**, **`DOWN`**, and **`OCTAVE`**.
  - Shape your sound using the **Cutoff**, **Resonance**, **Attack**, **Release**, and **Octave** controls.

### 4. Perform with Master FX & Live CRT Visualizer
- **Live CRT Audio Analyzer**: Toggle between **`SCOPE`** (stepped 8-bit oscilloscope), **`SPECTRUM`** (pixel frequency bars), or **`BOTH`**.
- **Master Controls**:
  - **Tempo Slider & Tap Tempo**: Drag from `60 BPM` to `220 BPM`, or click **`Tap Tempo`** repeatedly to match any beat.
  - **Swing Groove**: Add `0%` to `65%` shuffle to 16th notes.
  - **8-Bit Crush**: Dial in authentic staircase amplitude quantization distortion.
  - **Tape Echo Mix & Master LP Filter**: Add stereo rhythmic delay and full-mix filter sweeps.
  - **Hold: Beat Glitch**: Press and hold for a live 32nd-note beat-repeat stutter effect.
  - **Randomize Beat**: Instantly generate a brand-new musical drum groove and C-minor pentatonic synth line.

---

## How to Deploy for Free (3 Easy Ways)

Because BITPULSE-16 runs 100% in the browser using the Web Audio API, you can host it for **free forever** on any static host.

### Option 1: GitHub Pages (Automatic via Included Workflow)
We have included a ready-to-use GitHub Actions workflow in `.github/workflows/deploy.yml` and configured `vite.config.ts` with `base: './'`.
1. Push this code to a public **GitHub repository** (using the **Export to GitHub** button in AI Studio or via `git push`).
2. In your GitHub repository, go to **Settings** → **Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and publish your live app at:
   `https://<your-username>.github.io/<your-repo-name>/`

### Option 2: Vercel (1-Click Free Hosting)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click **Add New Project**.
3. Import your repository — Vercel automatically detects **Vite** (`npm run build`, output folder `dist`) and gives you a free `.vercel.app` link in ~30 seconds.

### Option 3: Netlify (Drag & Drop or GitHub Import)
1. Go to [netlify.com](https://www.netlify.com) and click **Add new site → Import an existing project**.
2. Connect your GitHub repository (Build command: `npm run build`, Publish directory: `dist`).

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server (http://localhost:3000)
npm run dev

# 3. Build production static bundle into /dist
npm run build
```

---

## License

Apache-2.0
