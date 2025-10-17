# Reader's Haven

Reader's Haven is a lightweight, single-page reading tracker that celebrates the books you love. The application focuses on three core experiences—favoriting titles, leaving reflective comments, and reviewing a personal activity log—while ensuring everything persists locally between visits.

## Getting started

No build tooling is required. Clone the repository (or download the source) and open `index.html` in any modern browser. Because all data is stored in `localStorage`, the experience works entirely offline after the first load.

```text
project/
├── index.html
├── styles.css
├── app.js
└── README.md
```

For the richest behavior, run the app from a simple static server (for example, `python3 -m http.server`) to mirror a production-like environment.

## Feature highlights

- **Three core routes** powered by hash-based navigation: a welcoming Home view, a Library catalogue, and the Profile dashboard.
- **Favorites management** with instant feedback. Toggling a favorite in the Library immediately updates the Profile view and navigation badges.
- **Commenting system** that stores notes per book, exposes inline editing controls, and groups reflections by title in the Profile.
- **Likes tracking** to acknowledge standout books. The profile summary surfaces the total likes cast.
- **Activity log** summarizing the latest favorites, likes, and comments with relative timestamps.
- **Persistent state** stored in `localStorage`, enabling the same data to appear across sessions without external services.

## Responsive experience

The interface received a responsive polish:

- A mobile-friendly navigation drawer with a backdrop and focus management.
- Flexible typography and spacing via `clamp()` so text scales gracefully between viewports.
- Grid layouts for favorites, stats, and the library catalogue that adapt from single column to multi-column as space allows.
- Touch-friendly tap targets and consistent button styling across screen sizes.

## Persistence & UX validation

Persistence and cross-view synchronization were manually verified:

- Favoriting a book in the Library reflects instantly in the Profile and remains after refresh.
- Removing a favorite or deleting a comment from the Profile updates the Library cards without extra input.
- Comments persist per book, are grouped correctly in the Profile, and survive navigation or a full reload.
- Navigation between Home, Library, and Profile retains scroll focus and closes the mobile drawer automatically.

## Limitations

- Data lives exclusively in the browser's `localStorage`. Clearing browser storage or switching devices wipes the library, favorites, and comments.
- The book catalogue is simulated; there is no backend API or ability to add custom titles.
- The activity log caps the tracked events to the 30 most recent interactions to avoid runaway growth.

## Accessibility considerations

- Landmarks, focus management, and keyboard-accessible controls were added to help screen reader and keyboard users.
- Color contrast aims to meet WCAG AA guidance, though further audits are recommended before shipping to production.

Feel free to expand the dataset or integrate real services—the UI and state management structure are ready to grow.
