# MedTrack - Family Lab Tracker

Privacy-focused web app for tracking medical lab results. Upload PDF lab reports and AI extracts structured data automatically. Track trends, manage multiple family members, all data stays in your browser.

## Live App

https://inderpreetsingh11.github.io/Dev-Claude/

## Operator Setup (MacBook)

The AI backend runs on your MacBook via Ollama + Cloudflare Tunnel.

### 1. Install & run Ollama

```bash
brew install ollama
ollama pull gemma4:e4b
OLLAMA_ORIGINS=* ollama serve
```

### 2. Expose to internet

```bash
# Option A: Cloudflare Tunnel (free, no account needed)
brew install cloudflared
cloudflared tunnel --url http://localhost:11434

# Option B: ngrok
ngrok http 11434
```

### 3. Set the tunnel URL

**Option A — GitHub variable (persists across deploys):**

Go to GitHub repo → Settings → Secrets and variables → Actions → Variables tab → New variable:
- Name: `VITE_OLLAMA_URL`
- Value: `https://your-tunnel-url.trycloudflare.com`

Re-run the deploy workflow.

**Option B — In-app admin mode:**

Open the app → Settings → tap "Settings" header 5 times → enter the tunnel URL → Save.

### For persistent tunnel URLs

Use Cloudflare named tunnels (free with Cloudflare account):

```bash
cloudflared tunnel create medtrack
cloudflared tunnel route dns medtrack medtrack.yourdomain.com
cloudflared tunnel run medtrack
```

## Development

```bash
npm install
npm run dev
```

## Tech Stack

React 19 / TypeScript / Vite / Tailwind CSS v4 / recharts / Gemma 4 E4B via Ollama
