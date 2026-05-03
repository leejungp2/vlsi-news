# Newsstand

Desktop news portal. React + Vite + TypeScript. Fixed 1280×720 canvas.

## Stack
- React 19 + Vite + TS
- Vanilla CSS + CSS Modules, design tokens as CSS variables
- State: `useState` / `useReducer` only (no Zustand/Redux/Context)
- Animation: CSS transitions/keyframes only
- Data: local JSON
- Fonts: Pretendard (CDN), IBM Plex Mono + Noto Serif KR (Google Fonts)

## Refs
- `news_design.pdf` — design spec (tokens, components)
- `news_plan.pdf` — 6 frame canvas
- `README.md` — commit checklist

## Constraints
- Colors: only tokens from design.pdf §2. `#7890E7` accent reserved for sub-count badge + active tab.
- Fonts: Pretendard / IBM Plex Mono (digits) / Noto Serif KR (serif wordmarks)
- Strokes: always 1px `#D2DAE0`
- Layout: content 930, gutters 175, fixed 1280

## Rules
- Coursework repo — never run git commands; only print them
- Never include "Claude" or `Co-Authored-By` in commit messages