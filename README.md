# FocusBoost

A polished productivity dashboard built with `Next.js`, `React`, and `TypeScript`. AntiGravity combines focus sessions, task and habit tracking, note taking, analytics, and gamified progress into a single ambient productivity OS.

## Features

- Landing page with animated hero and workspace launch flow
- Dashboard overview with streaks, XP level, and daily focus score
- Pomodoro-style focus timer with ambient audio and session state
- Analytics, calendar, notes, tasks, timer, profile, and settings pages
- Responsive, glassmorphism-inspired UI built with Tailwind CSS
- Client-side state management using `zustand`
- Modern UI interactivity via `framer-motion` and iconography from `lucide-react`

## Tech Stack

- Frontend framework: `Next.js` 16
- UI library: `React` 19 with `TypeScript`
- Styling: `Tailwind CSS` v4
- State: `zustand`
- Animations: `framer-motion`
- Charts: `recharts`
- Sound effects: `canvas-confetti`

## Project Structure

- `src/app/` - application routes and page components
- `src/app/dashboard/` - main productivity workspace pages
- `src/components/` - reusable UI components
- `src/store/useProductivityStore.ts` - global client-side state store
- `src/lib/utils.ts` - shared helper utilities

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - build production application
- `npm run start` - run built production app
- `npm run lint` - run ESLint checks

## Notes

- This repository is primarily a frontend Next.js application.
- There is no separate backend service included; server-side logic would be handled through Next.js if API routes are added later.

## License

This project does not include a license file. Add one if you want to distribute or share the code publicly.
