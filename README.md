# Leafline Library SPA

A React single-page application scaffolded with [Vite](https://vite.dev) that
lays the foundation for a modern digital library experience inspired by
Z-Library. The repository currently provides the baseline UI shell along with
planning documentation for a platform that will eventually host 1,000 books
across philosophy, programming, and humanities/social sciences.

## Project overview

Planned capabilities include:
- **1,000 curated books** across three main categories:
  - Philosophy (classic and contemporary philosophical works)
  - Programming (software development practices, algorithms, and tooling)
  - Humanities & Social Sciences (history, psychology, sociology, anthropology)
- **User authentication** with secure login and registration
- **Interactive features**: likes, saves, favorites, and comments
- **Advanced browsing**: search, filtering, and sorting capabilities
- **User profiles**: track reading progress and saved books
- **Discussion system**: community engagement through comments

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

## Technology stack

### Frontend (current)
- **Framework**: React 19.1
- **Build tool**: Vite 7
- **Routing**: React Router DOM 7
- **Styling**: SCSS + CSS Modules
- **Linting**: ESLint 9

### Backend (planned)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: Auth0 or JWT-based authentication
- **Databases**:
  - PostgreSQL (relational data: books, users, favorites, likes, reading progress)
  - MongoDB (flexible data: comments, notifications, activity logs)

### Hosting (planned)
- **Options**: AWS, DigitalOcean, or similar cloud provider
- **CDN**: For static assets and book covers
- **SSL/TLS**: For secure connections

## Project documentation

- [Project plan](docs/PROJECT_PLAN.md)
- [API design](docs/API_DESIGN.md)
- [Database design](docs/DATABASE_DESIGN.md)
- [UI/UX design](docs/UI_UX_DESIGN.md)
- [Deployment guide](docs/DEPLOYMENT_GUIDE.md)
- [Testing strategy](docs/TESTING_STRATEGY.md)
