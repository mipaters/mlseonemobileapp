# MLSE One (Concept Demo)

A mobile-first, single-fan super-app concept for a unified Toronto Maple Leafs + Toronto Blue Jays
fan experience — personalized content, an AI concierge ("Ask Cito"), SportsIQ fan intelligence,
Game Day mode, Rewards and commerce, a Digital Locker, Fan DNA, and an Executive View dashboard
that explains the underlying (illustrative) Microsoft architecture.

> **Disclaimer:** This is a fictional concept product built for demonstration purposes only. It is
> **not** an official product of MLSE, the Toronto Maple Leafs, the Toronto Blue Jays, the NHL, MLB,
> Rogers, or Microsoft. All data, metrics, player references, offers, and architecture diagrams are
> **simulated/illustrative** and do not reflect real systems, real fans, or real business results.

## Why mobile-first

MLSE One is designed primarily as a **mobile app experience**. On a phone-sized viewport (or inside
the phone frame shown on desktop), you get the full fan experience: personalized home feed, Watch,
Game Day mode, Rewards, and Ask Cito, all reachable from a persistent bottom navigation bar. On a
desktop/laptop browser, the app renders a presentation shell: the mobile app inside a fixed phone
frame, plus a switch into a full-bleed **Executive View** dashboard for a business-outcomes narrative
and an architecture walkthrough — without ever needing a separate device.

## Key experiences

- **Home** — a personalized greeting, a "Your Toronto Sports Weekend" hero card combining upcoming
  Leafs and Jays games, and ranked content rows (For You, Continue Watching, Because You Follow Both
  Teams, Recommended Experiences).
- **Watch** — a daily recap player with chapters, a "Why this recap was created for Mike"
  explainability panel, related highlights, and a SportsIQ-driven highlight reel builder.
- **Game Day** — a live, team-switchable mode with a mobile ticket wallet, seat upgrades, venue
  arrival simulation, food/gate guidance, and mission progress.
- **Rewards** — tier progress, missions, a rewards catalog, a rewards wallet, and illustrative
  partner offers with "why am I seeing this" transparency.
- **Digital Locker** — purchased/unlocked merchandise and curated shop-by-section recommendations,
  with a simulated cart and checkout.
- **Ask Cito** — a chat-first concierge with eight deterministic, keyword-matched journeys (weekend
  planning, game-day planning per team, combined highlights, rewards, seat upgrades, merchandise,
  venue help, and "what should I watch") — see [Ask Cito is deterministic, not generative](#ask-cito-is-deterministic-not-generative) below.
- **Fan DNA, Agent Activity & Privacy** — a living SportsIQ profile (affinity scores, a signal
  timeline, next-best-action, and an explainability sheet), an animated "personalization cycle" that
  shows the underlying agents at work, and user-facing privacy toggles that visibly change the
  personalization experience when turned off.
- **Executive View & Architecture** — KPI, funnel, and revenue-pool dashboards with illustrative
  business-outcome narratives, plus a clickable Microsoft-style target architecture explorer.
- **Guided walkthrough** — a 12-step, scripted "executive demo" overlay that narrates the product
  story end to end, navigating and spotlighting real UI as it goes.

## Ask Cito is deterministic, not generative

Ask Cito in this demo does **not** call any AI model. It uses a small, deterministic keyword-matching
engine (`src/lib/citoEngine.ts`) to map a typed or suggested prompt to one of a fixed set of
"journeys," each of which renders a rich, pre-built response card. This keeps the demo fast, free,
and 100% reproducible for presentations. The engine's calling interface (`matchIntent(message)` → a
journey + reply) is intentionally narrow so that it could later be swapped for a real call to
**Azure AI Foundry** / Azure OpenAI without changing any UI code.

## SportsIQ (fan intelligence) is simulated

"SportsIQ" is the demo's name for the fan-intelligence layer. Its signals, agent activity feed,
affinity scores, and "next best action" are all simulated locally in the browser — driven by your
own interactions with the demo (liking/saving content, redeeming rewards, accepting a game-day plan,
etc.) — not by a real backend, real telemetry pipeline, or Microsoft Fabric deployment. The
Architecture page describes how a production version *could* be built on Microsoft Fabric, Azure AI
Foundry, and related Azure services, but none of that infrastructure exists behind this demo.

## Tech stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` configuration via `@tailwindcss/vite`)
- [react-router-dom](https://reactrouter.com/) for client-side routing
- [recharts](https://recharts.org/) for the Fan DNA radar chart and Executive View visualizations
- [lucide-react](https://lucide.dev/) for icons
- A single React Context + `useReducer` global store (`src/store/AppState.tsx`) with `localStorage`
  persistence — no backend, no network calls, no external APIs

## Getting started

```bash
npm install
npm run dev       # start the local dev server (http://localhost:5173)
npm run build      # type-check (tsc -b) and produce a production build in dist/
npm run preview    # preview the production build locally
npm run lint       # run oxlint
```

Resize your browser below ~1024px width (or use your browser's device toolbar) to see the primary
mobile experience. Above that width, the app renders inside a fixed phone frame alongside a
switch into the Executive View.

## Resetting the demo

Use the profile menu (tap your avatar in the header) → **Reset Demo** to restore all simulated state
(liked/saved content, rewards balance, missions, tickets, cart, Fan DNA, agent activity, privacy
preferences, etc.) back to its original starting point. The same menu offers **Start Executive Demo**
to launch the guided 12-step walkthrough at any time.

## Deployment

`staticwebapp.config.json` is included for deployment to **Azure Static Web Apps**, with a SPA
navigation fallback to `index.html` so client-side routes (e.g. `/watch`, `/profile/fan-dna`,
`/executive/architecture`) resolve correctly on a full page refresh or direct link.

## Project structure

```
src/
  types/            Shared TypeScript domain types
  data/              Simulated/mock data (teams, content, games, rewards, Fan DNA, architecture, …)
  store/             Global state (AppState.tsx) — the single source of truth for all demo state
  lib/                Ask Cito's deterministic intent-matching engine
  hooks/             Shared hooks (e.g. useIsDesktop)
  components/
    shell/           App shell: header, bottom nav, phone frame, desktop shell, walkthrough overlay
    ui/              Shared primitives: Button, Sheet, Chip, ProgressBar, Toast, ContentCard, …
    content/         Shared content detail sheet
    watch/ gameday/ rewards/ commerce/ cito/   Feature-specific components
  pages/             One file per route, plus pages/profile/* and top-level Executive/Architecture pages
  routes/            AppRoutes.tsx — the route table
```

## Future integration notes (not implemented)

This demo is intentionally self-contained. A production evolution of this concept would likely:

- Replace `src/lib/citoEngine.ts`'s deterministic matcher with a real call to **Azure AI Foundry** /
  Azure OpenAI, keeping the same `matchIntent`-style calling convention.
- Replace the simulated SportsIQ signals/agent activity with real event ingestion into
  **Microsoft Fabric** (OneLake, real-time eventing, a semantic model) as outlined on the
  Architecture page.
- Replace simulated tickets, seat upgrades, and checkout with real ticketing and payment provider
  integrations.
- Add real authentication (e.g. **Microsoft Entra ID**) and a real consent/privacy backend in place
  of the local, in-browser privacy toggles.

None of the above exists today — everything in this repository runs entirely client-side with mock
data.
