Build a modern, production-quality productivity web app called **FlowZone** — not a basic “vibe coded” landing page, but a polished, scalable SaaS-style application with thoughtful UX, clean architecture, smooth animations, and real usability.

Design aesthetic:

* Minimal but premium
* Blend of Linear + Notion + Arc Browser aesthetics
* Dark mode first with elegant accent colors (deep purple, electric blue, soft gradients)
* Glassmorphism used subtly, not excessively
* Excellent typography hierarchy
* Spacious layouts with clean grids
* Beautiful hover states and microinteractions
* Fully responsive for desktop, tablet, and mobile
* Smooth page transitions and Framer Motion animations
* Accessibility-friendly contrast and keyboard navigation
* Use modern UI principles, not generic Tailwind spam

Core features:

1. Focus Dashboard

* Personalized greeting
* Daily focus score
* Productivity streak counter
* Quick overview cards
* Motivational quote section
* Animated progress rings

2. Advanced Pomodoro Timer

* Custom focus/break durations
* Auto-start next session
* Ambient sounds (rain, café, white noise)
* Session history analytics
* Deep focus mode (fullscreen distraction-free UI)
* Pause/resume/reset
* Keyboard shortcuts
* Circular animated timer
* Timer themes
* Focus music integration placeholder

3. Smart Task Management

* Create/edit/delete tasks
* Drag-and-drop task organization
* Priority levels
* Tags/categories
* Due dates
* Recurring tasks
* Subtasks
* Progress tracking
* Kanban + List view toggle
* Smart sorting and filtering
* AI-assisted task breakdown placeholder

4. Checklist System

* Beautiful animated checkboxes
* Strike-through completion animations
* Progress percentage
* Daily habits checklist
* Weekly goals checklist
* Streaks for habits
* Reward/confetti animations on completion

5. Productivity Analytics

* Weekly/monthly reports
* Focus heatmaps
* Time spent charts
* Completion rate graphs
* Most productive hours tracking
* Session consistency score

6. Notes & Brain Dump

* Quick notes panel
* Markdown support
* Rich text editor
* Pinned notes
* Search notes instantly
* Auto-save

7. Calendar & Planning

* Integrated calendar view
* Daily planner
* Weekly planning board
* Timeline visualization
* Schedule focus sessions

8. Gamification

* XP points system
* Levels and achievements
* Productivity streaks
* Unlockable themes
* Focus leaderboard placeholder

9. UI/UX Requirements

* Proper loading skeletons
* Empty states with illustrations
* Toast notifications
* Smooth modals and drawers
* Beautiful settings page
* Command palette (Cmd/Ctrl + K)
* Sidebar navigation with collapsing
* Multi-theme support
* Custom cursor effects (subtle)
* Responsive charts and cards
* Sticky widgets
* Floating quick-add button

10. Authentication & Data

* Functional Email & Password Sign Up and Login powered by **Firebase Authentication**
* Beautiful OAuth mock portals (Google & GitHub)
* Real-time **Firebase Firestore** cloud synchronization for all tasks, habits, goals, notes, stats, and focus records
* Resilient offline-first persistence with automatic, zero-config local storage fallbacks if Firebase keys are unconfigured
* Modular, reactive state store with automated sync queues

11. Suggested Tech Stack
    Frontend:

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS / Vanilla CSS HSL design system
* Framer Motion animations
* Lucide Icons

State & Data:

* Zustand (with custom state syncing hooks)
* Firebase Client SDK (Auth, Firestore)

Charts:

* Recharts

12. Fully Implemented Premium Features

* **AI Productivity Assistant Drawer**: Contextual chat panel providing behavioral suggestions and personalized workflow coaching.
* **Interactive AI Task Breakdown**: Fully animated subtask generators that break down complex task descriptions in one click.
* **Spotify Focus Audio Center**: Integrated player inside the timer page hosting curated study channels, synced seamlessly with ambient sound machines and sliders.
* **Community Focus Leaderboard**: Live gamified rank boards fetching high-performing focus users from Firestore database with custom tiers.
* **Mood & Energy tracker**: Interactive dashboard logging with dynamic color cards tracking correlation between mental state and productivity.
* **Deep Work Statistics**: Heatmaps, focus-to-energy trend charts, and consistency metrics.

13. Pages to Include

* Landing page
* Dashboard
* Tasks page
* Focus timer page
* Analytics page
* Notes page
* Calendar page
* Settings page
* Profile page

14. Design Expectations

* Every section should feel intentionally designed
* Avoid generic dashboards
* Use layered depth, gradients, blur, shadows carefully
* Make animations meaningful and smooth
* Maintain visual consistency
* Make the app look like a premium startup product people would actually pay for
* Include realistic demo data
* Use proper spacing and alignment
* Avoid clutter while still being feature-rich

15. Final Goal
    The website should feel like a polished productivity operating system — immersive, motivating, modern, elegant, and genuinely useful. It should look like a real funded startup product, not a quick prototype.

### Setup & Dependency Requirements

Automatically initialize the project and install all required dependencies.

Requirements:

* Create a complete runnable Next.js project
* Configure TypeScript
* Install and configure:

  * Tailwind CSS
  * Framer Motion
  * shadcn/ui
  * Zustand
  * React Query / TanStack Query
  * Recharts
  * Lucide Icons
  * date-fns
  * clsx
  * tailwind-merge
* Generate proper folder structure
* Configure aliases (`@/components`, `@/lib`, etc.)
* Set up dark mode
* Configure responsive layout system
* Add reusable UI components
* Ensure zero TypeScript errors
* Ensure zero lint errors
* Ensure project runs immediately with:

  ```bash
  npm install
  npm run dev
  ```

Also:

* Create `.env.example`
* Add placeholder backend configs
* Add sample demo data
* Include proper README documentation
* Use production-level code organization
* Avoid placeholder-only UI; make components functional

> “Do not just generate UI mockups. Generate a fully runnable application with install commands, dependency setup, proper file structure, and production-quality components.”

