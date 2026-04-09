# MedTrack - Family Lab Tracker

Privacy-focused web app for tracking medical lab results. Upload PDF lab reports and AI extracts structured data automatically. Track trends, manage multiple family members, all data stays in your browser.

## Live App

https://inderpreetsingh11.github.io/Dev-Claude/

## Operator Setup (MacBook)

The AI backend runs on your MacBook via Ollama + CORS proxy + Cloudflare Tunnel.

### 1. Install & run Ollama

```bash
brew install ollama
ollama pull gemma4:e4b
ollama serve
```

### 2. Run the CORS proxy (new terminal tab)

```bash
node cors-proxy.js
```

This runs on port 11435 and forwards to Ollama on 11434 with CORS headers.

### 3. Expose to internet (new terminal tab)

```bash
cloudflared tunnel --url http://localhost:11435
```

Copy the tunnel URL (e.g. `https://abc-xyz.trycloudflare.com`) and set it in the app.

### 4. Set the tunnel URL in the app

Open app → Settings → tap "Settings" header 5 times → paste URL → Save.

## Development

```bash
npm install
npm run dev
```

## Tech Stack

React 19 / TypeScript / Vite / Tailwind CSS v4 / recharts / Gemma 4 E4B via Ollama
