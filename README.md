# Video Player Svelte

A local video player built with Svelte 5, TypeScript, and Tailwind CSS.

## Features

- Video playback with play/pause, seek, volume, and fullscreen controls
- SRT subtitle support with customizable styling (size, color, background, position)
- Recent videos list with automatic progress tracking and resume
- Settings popover with subtitle and playback options
- Picture-in-Picture support
- Toast notifications for player actions
- Keyboard shortcuts (see below)
- Accessible — ARIA labels and full keyboard navigation
- Error handling with re-select prompt when a file is no longer available

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` / `→` | Seek ±10 seconds |
| `↑` / `↓` | Volume ±5% |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |
| `P` | Toggle Picture-in-Picture |
| `Escape` | Close settings / Go home |

## Tech Stack

- [Svelte 5](https://svelte.dev)
- TypeScript
- Tailwind CSS v4
- Vite

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
