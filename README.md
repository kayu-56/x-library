# Leafline Library SPA

A React single-page application scaffolded with [Vite](https://vite.dev) that
lays the foundation for a modern digital library experience. The project
includes a responsive layout, global design tokens, and client-side routing for
core library views.

## Getting started

### Prerequisites

- Node.js 18 or later
- npm 9 or later (ships with Node.js)

### Installation

```bash
npm install
```

### Available scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reloading. |
| `npm run start`   | Alias for `npm run dev`.                              |
| `npm run build`   | Create an optimized production build.                 |
| `npm run preview` | Preview the production build locally.                 |
| `npm run lint`    | Lint all JavaScript/JSX files with ESLint.            |

## Project structure

```
src/
├─ components/
│  └─ layout/          # Shared layout primitives (header, footer, shell)
├─ pages/               # Route-level page placeholders
└─ styles/              # Global styling tokens and resets
```

## Styling & tooling

- Global typography, color, and spacing tokens are defined in
  `src/styles/global.scss` and are available across the app.
- Component-level styles use [CSS Modules](https://vite.dev/guide/features.html#css-modules)
  with SCSS for encapsulated styling.
- ESLint (ES2023 + React Hooks + React Refresh) is configured via
  `eslint.config.js` and can be run with `npm run lint`.

## Routing overview

Client-side routing is powered by `react-router-dom` and currently includes:

- `/` – Home landing experience
- `/browse` – Browse the full collection
- `/books/:bookId` – Placeholder detail view for a selected book
- `/profile` – User profile dashboard placeholder

Each route renders a placeholder component that can be extended with real data
and interaction flows as features are implemented.
