# Fusion Collab Platform

Fusion Collab is an AI-augmented engineering control centre that unifies code
reviews, pull request analytics, continuous quality guardrails, contextual
learning, and gamified skill development into a single responsive web
experience.

The application is implemented as a React single-page app powered by Vite and
ships with rich demonstrative data to showcase the core capabilities of the
platform.

## Core modules

| Module | Highlights |
| ------ | ---------- |
| **AI-enhanced diff viewer** | Language-aware syntax highlighting, semantic change heuristics, automated risk scoring, and actionable AI recommendations for each diff scenario. |
| **Pull request & commit analytics** | Sprint-level throughput dashboards with velocity trends, reviewer load balancing, AI adoption tracking, and detailed PR activity tables. |
| **Code quality intelligence** | Quality gate progress, sprint trends, prioritised risk alerts, module scorecards, and impact heatmaps driven by guardrail telemetry. |
| **Learning resource centre** | Context-aware recommendation engine that aligns resources, tags, and structured learning paths with active engineering initiatives. |
| **Gamified growth workspace** | Team XP summaries, radar-based skill visualisations, capability benchmarks, achievements, and personalised development cues. |

Each module shares a common design language, supports live guardrail status, and
is optimised for larger displays as well as tablets and mobile devices.

## Technology stack

- **Framework**: React 19 with functional components and hooks
- **Build tool**: Vite 7 for instant feedback and optimised builds
- **Routing**: React Router DOM 7 (client-side SPA navigation)
- **State**: Lightweight context provider with derived metrics
- **Visualisations**: Recharts for responsive dashboards and radar charts
- **Diff rendering**: `react-diff-viewer-continued` with Prism syntax highlighting
- **Styling**: SCSS modules with layout primitives defined in `src/styles/global.scss`

## Getting started

### Prerequisites

- Node.js **18+**
- npm **9+** (bundled with modern Node releases)

### Installation

```bash
npm install
```

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite development server with hot reloading. |
| `npm run build` | Produce an optimised production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Lint the project with ESLint. |

## Project structure

```
src/
├─ components/
│  ├─ common/           # Reusable primitives (e.g. progress bars)
│  └─ layout/           # Header, footer, and application shell
├─ contexts/            # Platform data provider and hooks
├─ data/                # Rich mock dataset powering each module
├─ pages/               # Route-level feature modules
├─ styles/              # Global tokens and resets
└─ utils/               # Shared analytics + AI insight helpers
```

## Feature walkthrough

### 1. AI-enhanced diff viewer
- Multi-language syntax highlighting (TypeScript, Python, Go)
- Semantic diff heuristics with risk scoring and change-surface analytics
- AI-generated recommendations with confidence bands and validation cues

### 2. Pull request analytics dashboard
- Area/column charts for commit velocity, code churn, and reviewer load
- Status breakdown cards with AI suggestion adoption tracking
- Rich PR table combining qualitative and quantitative insights

### 3. Code quality assessment
- Progressive quality bars mapped to guardrail thresholds
- Sprint-by-sprint trend lines for coverage, reliability, and security
- Ranked alert feed with severity, owner, and impacted metrics heatmap
- Module scorecards detailing risk, stability, and action items

### 4. Learning hub
- Context selector that filters resources by active initiative
- Tag-driven filtering with search across titles, summaries, and metadata
- Personalised, goal-driven learning path with resource lookups

### 5. Gamified growth
- Team XP and review throughput summaries
- Radar chart visualising individual competency profiles
- Capability matrix benchmarking vs. industry averages
- Achievement wall and skill heatmap for coaching at scale

## Accessibility & responsiveness

- All primary interactions are keyboard accessible
- Skip-to-content components use screen-reader-only classes in `global.scss`
- Layouts collapse gracefully to single-column on narrow displays (~640px)

## Next steps

The current implementation focuses on UI/UX and data modelling. Integrations for
real repositories (GitHub/GitLab), live telemetry, and role-based access control
can be layered onto this foundation via dedicated API gateways.

Feel free to extend the dataset, refine heuristics, or connect the views to your
organisation’s engineering data warehouse.
