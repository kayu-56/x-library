const BOOKS = [
  {
    id: "atlas-of-echoes",
    title: "Atlas of Echoes",
    author: "Elena Rivers",
    tagline: "A cartographer who maps memories across a living city.",
    description:
      "A lyrical exploration of a metropolis that remembers every footstep. Atlas of Echoes follows the cartographer Mara as she documents a city's emotional geography and uncovers a decades-old mystery woven into its streets.",
    tags: ["Speculative Fiction", "Found Family", "Slow Build"],
    communityLikes: 182,
    published: 2022,
    readingTime: "7 hrs",
  },
  {
    id: "luminary-threads",
    title: "Luminary Threads",
    author: "Jai Patel",
    tagline: "Siblings inherit a tailor shop that stitches light itself.",
    description:
      "Set in a bustling port city, Luminary Threads blends magical realism with heartfelt drama as two siblings discover that their family's textile craft can weave emotions, memories, and even futures into the garments they create.",
    tags: ["Magical Realism", "Sibling Story", "Cozy"],
    communityLikes: 264,
    published: 2021,
    readingTime: "5 hrs",
  },
  {
    id: "the-quiet-observatory",
    title: "The Quiet Observatory",
    author: "Sasha Lin",
    tagline: "An archivist discovers starlight-based recordings of the future.",
    description:
      "High atop an abandoned observatory, archivist Noa uncovers a cache of glass cylinders filled with 'starlight recordings'. Each glimpse into the future forces Noa to confront responsibility, choice, and the meaning of community.",
    tags: ["Science Fiction", "Hopepunk", "Atmospheric"],
    communityLikes: 198,
    published: 2020,
    readingTime: "6 hrs",
  },
  {
    id: "harvest-of-tides",
    title: "Harvest of Tides",
    author: "Marin Okafor",
    tagline: "A coastal village learns to listen to the ocean spirits.",
    description:
      "This hopeful eco-fable follows Ama, a marine biologist returning home, as she bridges ancestral tidekeeping rituals with modern science to save her community from encroaching storms and industrial greed.",
    tags: ["Eco Fable", "Mythic", "Community"],
    communityLikes: 241,
    published: 2023,
    readingTime: "8 hrs",
  },
  {
    id: "notes-from-aurora",
    title: "Notes from Aurora",
    author: "Claribel North",
    tagline: "Letters between a musician and an orbiting research station.",
    description:
      "Told through intimate letters, this epistolary novel traces a friendship that blossoms between a composer on Earth and a scientist stationed on Aurora, a glacial moon with shimmering ice caves.",
    tags: ["Epistolary", "Character-Driven", "Tender"],
    communityLikes: 156,
    published: 2019,
    readingTime: "4 hrs",
  },
  {
    id: "embers-of-ki",
    title: "Embers of Ki",
    author: "Rahul Devi",
    tagline: "An elemental chef rediscovers the flavors of her homeland.",
    description:
      "Chef Mira's dishes harness elemental magic, but when her spark fades she journeys across Ki to relearn the aromas of her childhood recipes, meeting culinary rebels and healers along the way.",
    tags: ["Quest", "Food Lit", "Vivid World"],
    communityLikes: 205,
    published: 2024,
    readingTime: "6 hrs",
  },
];

const BOOK_LOOKUP = new Map(BOOKS.map((book) => [book.id, book]));
const STORAGE_KEY = "readers-haven-state-v1";
const MAX_ACTIVITY = 30;

const DEFAULT_STATE = {
  favorites: [],
  likes: [],
  comments: {},
  activity: [],
};

const appRoot = document.querySelector("#app");
const topNav = document.querySelector("[data-drawer]");
const navBackdrop = document.querySelector("[data-drawer-backdrop]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const closeDrawerButton = document.querySelector("[data-close-drawer]");
const navFavoritePill = document.querySelector('[data-nav-pill="favorites"]');
const topbarFavorites = document.querySelector("[data-topbar-favorites]");
const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

let state = loadState();
let currentRoute = "home";
let drawerOpen = false;

const routes = {
  home: renderHome,
  library: renderLibrary,
  profile: renderProfile,
};

initialize();

function initialize() {
  renderNavigationSummary();
  setupNavigationControls();
  setupGlobalEventHandlers();

  if (!window.location.hash) {
    window.location.replace("#/home");
  } else {
    handleRouteChange();
  }
}

function setupNavigationControls() {
  const prefersLargeScreen = window.matchMedia("(min-width: 768px)");
  prefersLargeScreen.addEventListener("change", (event) => {
    if (event.matches) {
      setDrawer(false);
    }
  });

  menuToggle?.addEventListener("click", () => {
    setDrawer(!drawerOpen);
  });

  closeDrawerButton?.addEventListener("click", () => setDrawer(false));
  navBackdrop?.addEventListener("click", () => setDrawer(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawerOpen) {
      setDrawer(false);
    }
  });
}

function setupGlobalEventHandlers() {
  window.addEventListener("hashchange", () => {
    handleRouteChange();
    setDrawer(false);
  });

  document.body.addEventListener("click", (event) => {
    const actionTrigger = event.target.closest("[data-action]");
    if (!actionTrigger) return;
    const { action, bookId, commentId } = actionTrigger.dataset;

    switch (action) {
      case "toggle-favorite":
        if (bookId) toggleFavorite(bookId);
        break;
      case "remove-favorite":
        if (bookId) removeFavorite(bookId);
        break;
      case "toggle-like":
        if (bookId) toggleLike(bookId);
        break;
      case "delete-comment":
        if (bookId && commentId) deleteComment(bookId, commentId);
        break;
      default:
        break;
    }
  });

  document.body.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.matches("[data-action=comment-form]")) {
      event.preventDefault();
      const bookId = form.dataset.bookId;
      const input = form.querySelector("textarea, input[name=comment]");
      if (!bookId || !(input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement)) {
        return;
      }
      const rawValue = input.value.trim();
      if (!rawValue) return;
      addComment(bookId, rawValue);
      input.value = "";
      input.dispatchEvent(new Event("change"));
      input.blur();
    }
  });
}

function handleRouteChange() {
  const hash = window.location.hash.replace(/^#\//, "").split("?")[0];
  const nextRoute = routes[hash] ? hash : "home";
  if (currentRoute !== nextRoute) {
    currentRoute = nextRoute;
  }
  renderRoute(nextRoute);
}

function renderRoute(route) {
  const safeRoute = routes[route] ? route : "home";
  currentRoute = safeRoute;
  setActiveNavigation(safeRoute);
  const renderFn = routes[safeRoute];
  if (typeof renderFn === "function") {
    renderFn(appRoot);
  }
  focusMain();
}

function renderHome(container) {
  if (!container) return;
  const stats = calculateStats();
  const recentFavorites = state.favorites
    .map((id) => BOOK_LOOKUP.get(id))
    .filter(Boolean)
    .slice(0, 3);
  const recentComments = getRecentComments(3);

  container.innerHTML = `
    <section class="page home-page">
      <header class="hero">
        <div>
          <h1 class="hero__heading">Your reading pulse at a glance</h1>
          <p class="hero__description">
            Reader's Haven keeps your favorite stories, lingering thoughts, and
            literary wins in one beautifully organized space. Collect books,
            leave comments, and revisit every spark of inspiration.
          </p>
          <div class="hero__actions">
            <a class="button primary" href="#/library">Browse Library</a>
            <a class="button secondary" href="#/profile">View Profile</a>
          </div>
        </div>
        <div class="quick-stats">
          <article class="stat-card">
            <span class="stat-label">Total Favorites</span>
            <span class="stat-value">${stats.totalFavorites}</span>
            <span class="stat-trend">${stats.totalFavorites > 0 ? "You have a curated shelf." : "Start building your shelf."}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">Likes Cast</span>
            <span class="stat-value">${stats.likesCast}</span>
            <span class="stat-trend">${stats.likesCast ? "Sharing the love." : "Tap like on a book you adore."}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">Comments Logged</span>
            <span class="stat-value">${stats.totalComments}</span>
            <span class="stat-trend">${stats.totalComments ? "Your thoughts are saved for later." : "Add a note to remember why it resonated."}</span>
          </article>
        </div>
      </header>
      <section class="page-section">
        <header class="page-header">
          <h2 class="page-title">Recent favorites</h2>
          <p class="page-subtitle">A snapshot of the stories you're keeping close.</p>
        </header>
        ${recentFavorites.length ? renderFavoriteGrid(recentFavorites) : renderEmptyState({
          message: "You haven't favorited any books yet.",
          actionLabel: "Browse the library",
          actionHref: "#/library",
        })}
      </section>
      <section class="page-section">
        <header class="page-header">
          <h2 class="page-title">Recent reflections</h2>
          <p class="page-subtitle">
            Glance back at the thoughts you've captured while reading.
          </p>
        </header>
        ${recentComments.length ? `<ul class="activity-list">
          ${recentComments
            .map((entry) => {
              const book = BOOK_LOOKUP.get(entry.bookId);
              if (!book) return "";
              return `
                <li class="activity-item">
                  <span><strong>${escapeHtml(book.title)}</strong></span>
                  <span>${escapeHtml(truncate(entry.text, 140))}</span>
                  <span class="activity-meta">${formatRelativeTime(entry.timestamp)}</span>
                </li>
              `;
            })
            .join("")}
        </ul>` : renderEmptyState({
            message: "Your commentary will appear here once you add a note.",
            actionLabel: "Comment on a book",
            actionHref: "#/library",
          })}
      </section>
    </section>
  `;
}

function renderLibrary(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="page library-page">
      <header class="page-header">
        <h1 class="page-title">Library</h1>
        <p class="page-subtitle">
          Explore our curated shelf of atmospheric, hopeful reads. Favorite a
          title you love, tap like to show appreciation, or jot a quick note to
          remember what resonated.
        </p>
      </header>
      <div class="book-grid">
        ${BOOKS.map((book) => {
          const isFavorite = state.favorites.includes(book.id);
          const isLiked = state.likes.includes(book.id);
          const comments = getCommentsForBook(book.id);
          const userLikes = isLiked ? 1 : 0;
          return `
            <article class="book-card ${isFavorite ? "is-favorite" : ""}">
              <div>
                <h2 class="book-card__title">${escapeHtml(book.title)}</h2>
                <p class="book-card__meta">${escapeHtml(book.author)} · ${book.published}</p>
                <p>${escapeHtml(book.tagline)}</p>
                <p>${escapeHtml(book.description)}</p>
                <div class="tag-group">
                  ${book.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                </div>
              </div>
              <div class="card-actions">
                <button
                  class="button primary"
                  data-action="toggle-favorite"
                  data-book-id="${book.id}"
                >
                  ${isFavorite ? "Favorited" : "Add to Favorites"}
                </button>
                <button
                  class="button ghost"
                  data-action="toggle-like"
                  data-book-id="${book.id}"
                >
                  ${isLiked ? "Unlike" : "Like"}
                </button>
              </div>
              <div class="meta-info">
                <span class="meta-badge ${isLiked ? "is-liked" : ""}">
                  ❤ ${book.communityLikes + userLikes} likes
                </span>
                <span>${book.readingTime}</span>
                <span>${comments.length} ${comments.length === 1 ? "comment" : "comments"}</span>
              </div>
              <section class="discussion">
                <h3>Discussion</h3>
                ${comments.length ? `<ul class="comment-list">
                  ${comments
                    .map((comment) => `
                      <li class="comment-item">
                        <div>${escapeHtml(comment.text)}</div>
                        <div class="comment-meta">
                          <span>${formatDateTime(comment.timestamp)}</span>
                          <span class="comment-actions">
                            <button
                              class="inline-button"
                              data-action="delete-comment"
                              data-book-id="${book.id}"
                              data-comment-id="${comment.id}"
                            >
                              Delete
                            </button>
                          </span>
                        </div>
                      </li>
                    `)
                    .join("")}
                </ul>` : `<div class="empty-state">Be the first to add a note about this story.</div>`}
                <form class="comment-form" data-action="comment-form" data-book-id="${book.id}">
                  <label class="sr-only" for="comment-${book.id}">Add comment for ${escapeHtml(book.title)}</label>
                  <textarea id="comment-${book.id}" name="comment" placeholder="What stayed with you?" maxlength="500"></textarea>
                  <button class="button secondary" type="submit">Save comment</button>
                </form>
              </section>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderProfile(container) {
  if (!container) return;
  const stats = calculateStats();
  const favoriteBooks = state.favorites
    .map((id) => BOOK_LOOKUP.get(id))
    .filter(Boolean);
  const commentsByBook = getCommentsGroupedByBook();
  const recentActivity = getRecentActivity(6);

  container.innerHTML = `
    <section class="page profile-page">
      <header class="page-header">
        <h1 class="page-title">Your profile</h1>
        <p class="page-subtitle">
          This hub reflects every favorite, like, and comment you've shared. Edit freely—changes stay in sync wherever you explore.
        </p>
      </header>

      <section class="profile-summary">
        <article class="summary-card">
          <span class="summary-card__label">Favorite books</span>
          <span class="summary-card__value">${stats.totalFavorites}</span>
          <span class="summary-card__detail">A curated shelf of joy.</span>
        </article>
        <article class="summary-card">
          <span class="summary-card__label">Likes cast</span>
          <span class="summary-card__value">${stats.likesCast}</span>
          <span class="summary-card__detail">A nod to the stories that dazzled.</span>
        </article>
        <article class="summary-card">
          <span class="summary-card__label">Recent activity</span>
          <span class="summary-card__value">${stats.lastActivity ? formatRelativeTime(stats.lastActivity) : "No activity"}</span>
          <span class="summary-card__detail">
            ${stats.totalComments ? `${stats.totalComments} total comments logged.` : "Add a reflection to capture your thoughts."}
          </span>
        </article>
      </section>

      <section class="page-section">
        <header class="page-header">
          <h2 class="page-title">Favorites</h2>
          <p class="page-subtitle">Remove a title to tidy your shelf or revisit it in the library.</p>
        </header>
        ${favoriteBooks.length ? `<div class="favorites-grid">
          ${favoriteBooks
            .map((book) => `
              <article class="favorite-card">
                <h3>${escapeHtml(book.title)}</h3>
                <p>${escapeHtml(book.tagline)}</p>
                <div class="favorite-card__actions">
                  <button class="button ghost" data-action="remove-favorite" data-book-id="${book.id}">Remove</button>
                </div>
              </article>
            `)
            .join("")}
        </div>` : renderEmptyState({
            message: "No favorites yet—discover something magical in the library.",
            actionLabel: "Browse library",
            actionHref: "#/library",
          })}
      </section>

      <section class="page-section">
        <header class="page-header">
          <h2 class="page-title">Comments by book</h2>
          <p class="page-subtitle">Your notes, automatically grouped so you can revisit them later.</p>
        </header>
        ${commentsByBook.length ? commentsByBook
            .map(({ book, comments }) => `
              <article class="comment-group">
                <div class="comment-group__header">
                  <h3>${escapeHtml(book.title)}</h3>
                  <span class="meta-badge">${comments.length} ${comments.length === 1 ? "comment" : "comments"}</span>
                </div>
                <ul class="comment-list">
                  ${comments
                    .map((comment) => `
                      <li class="comment-item">
                        <div>${escapeHtml(comment.text)}</div>
                        <div class="comment-meta">
                          <span>${formatDateTime(comment.timestamp)}</span>
                          <span class="comment-actions">
                            <button
                              class="inline-button"
                              data-action="delete-comment"
                              data-book-id="${book.id}"
                              data-comment-id="${comment.id}"
                            >Delete</button>
                          </span>
                        </div>
                      </li>
                    `)
                    .join("")}
                </ul>
              </article>
            `)
            .join("") : renderEmptyState({
            message: "Your reflections will gather here after you add comments in the library.",
            actionLabel: "Leave a comment",
            actionHref: "#/library",
          })}
      </section>

      <section class="page-section">
        <header class="page-header">
          <h2 class="page-title">Activity log</h2>
          <p class="page-subtitle">A chronological peek at your latest moves.</p>
        </header>
        ${recentActivity.length ? `<ul class="activity-list">
          ${recentActivity
            .map((entry) => `
              <li class="activity-item">
                <span>${escapeHtml(describeActivity(entry))}</span>
                <span class="activity-meta">${formatRelativeTime(entry.timestamp)}</span>
              </li>
            `)
            .join("")}
        </ul>` : renderEmptyState({
            message: "Your activity timeline will appear once you start interacting.",
            actionLabel: "Explore the library",
            actionHref: "#/library",
          })}
      </section>
    </section>
  `;
}

function renderFavoriteGrid(books) {
  if (!books.length) return "";
  return `<div class="favorites-grid">
    ${books
      .map(
        (book) => `
          <article class="favorite-card">
            <h3>${escapeHtml(book.title)}</h3>
            <p>${escapeHtml(book.tagline)}</p>
            <div class="favorite-card__actions">
              <a class="inline-button" href="#/library">View in library</a>
            </div>
          </article>
        `
      )
      .join("")}
  </div>`;
}

function renderEmptyState({ message, actionLabel, actionHref }) {
  const actionMarkup =
    actionLabel && actionHref
      ? `<p><a class="button secondary" href="${escapeHtml(actionHref)}">${escapeHtml(actionLabel)}</a></p>`
      : "";
  return `
    <div class="empty-state">
      <p>${escapeHtml(message)}</p>
      ${actionMarkup}
    </div>
  `;
}

function toggleFavorite(bookId) {
  if (!BOOK_LOOKUP.has(bookId)) return;
  const existingIndex = state.favorites.indexOf(bookId);
  if (existingIndex >= 0) {
    state.favorites.splice(existingIndex, 1);
    addActivity("favorite_removed", { bookId });
  } else {
    state.favorites.unshift(bookId);
    addActivity("favorite_added", { bookId });
  }
  persistState();
  refreshUI();
}

function removeFavorite(bookId) {
  const index = state.favorites.indexOf(bookId);
  if (index === -1) return;
  state.favorites.splice(index, 1);
  addActivity("favorite_removed", { bookId });
  persistState();
  refreshUI();
}

function toggleLike(bookId) {
  if (!BOOK_LOOKUP.has(bookId)) return;
  const existingIndex = state.likes.indexOf(bookId);
  if (existingIndex >= 0) {
    state.likes.splice(existingIndex, 1);
    addActivity("like_removed", { bookId });
  } else {
    state.likes.unshift(bookId);
    addActivity("like_added", { bookId });
  }
  persistState();
  refreshUI();
}

function addComment(bookId, text) {
  if (!BOOK_LOOKUP.has(bookId)) return;
  const safeText = text.trim();
  if (!safeText) return;
  const comment = {
    id: createId("comment"),
    text: safeText,
    timestamp: new Date().toISOString(),
  };
  if (!Array.isArray(state.comments[bookId])) {
    state.comments[bookId] = [];
  }
  state.comments[bookId].unshift(comment);
  addActivity("comment_added", { bookId, detail: safeText });
  persistState();
  refreshUI();
}

function deleteComment(bookId, commentId) {
  const comments = getCommentsForBook(bookId);
  if (!comments.length) return;
  const targetIndex = comments.findIndex((comment) => comment.id === commentId);
  if (targetIndex === -1) return;
  const [removed] = comments.splice(targetIndex, 1);
  if (!comments.length) {
    delete state.comments[bookId];
  }
  addActivity("comment_removed", { bookId, detail: removed.text });
  persistState();
  refreshUI();
}

function refreshUI() {
  renderNavigationSummary();
  renderRoute(currentRoute);
}

function renderNavigationSummary() {
  const count = state.favorites.length;
  if (navFavoritePill) {
    navFavoritePill.textContent = count ? String(count) : "";
  }
  if (topbarFavorites) {
    topbarFavorites.textContent = count ? String(count) : "";
    topbarFavorites.style.display = count ? "inline-flex" : "none";
  }
}

function setActiveNavigation(route) {
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    if (!(link instanceof HTMLElement)) return;
    const linkRoute = link.dataset.route;
    link.classList.toggle("is-active", linkRoute === route);
  });
}

function setDrawer(open) {
  drawerOpen = Boolean(open);
  topNav?.setAttribute("data-open", open ? "true" : "false");
  topNav?.setAttribute("aria-hidden", open ? "false" : "true");
  menuToggle?.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("drawer-open", open);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return cloneDefaultState();
    }
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (error) {
    console.warn("Unable to load saved reading state:", error);
    return cloneDefaultState();
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Unable to persist reading state:", error);
  }
}

function normalizeState(data) {
  const normalized = cloneDefaultState();
  if (data && Array.isArray(data.favorites)) {
    normalized.favorites = unique(data.favorites.filter(isKnownBook));
  }
  if (data && Array.isArray(data.likes)) {
    normalized.likes = unique(data.likes.filter(isKnownBook));
  }
  if (data && data.comments && typeof data.comments === "object") {
    normalized.comments = {};
    Object.entries(data.comments).forEach(([bookId, value]) => {
      if (!isKnownBook(bookId) || !Array.isArray(value)) return;
      normalized.comments[bookId] = value
        .filter((comment) => comment && typeof comment.text === "string" && comment.timestamp)
        .map((comment) => ({
          id: comment.id || createId("comment"),
          text: comment.text,
          timestamp: comment.timestamp,
        }));
    });
  }
  if (data && Array.isArray(data.activity)) {
    normalized.activity = data.activity
      .filter(isValidActivity)
      .slice(0, MAX_ACTIVITY);
  }
  return normalized;
}

function cloneDefaultState() {
  return {
    favorites: [...DEFAULT_STATE.favorites],
    likes: [...DEFAULT_STATE.likes],
    comments: { ...DEFAULT_STATE.comments },
    activity: [...DEFAULT_STATE.activity],
  };
}

function unique(array) {
  return Array.from(new Set(array));
}

function isKnownBook(bookId) {
  return BOOK_LOOKUP.has(bookId);
}

function addActivity(type, { bookId = null, detail = null } = {}) {
  const entry = {
    id: createId("act"),
    type,
    bookId,
    detail,
    timestamp: new Date().toISOString(),
  };
  state.activity.unshift(entry);
  if (state.activity.length > MAX_ACTIVITY) {
    state.activity = state.activity.slice(0, MAX_ACTIVITY);
  }
}

function isValidActivity(entry) {
  if (!entry || typeof entry !== "object") return false;
  const { type, timestamp, bookId } = entry;
  if (typeof type !== "string" || !timestamp) return false;
  if (bookId && !BOOK_LOOKUP.has(bookId)) return false;
  return true;
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function calculateStats() {
  const totalFavorites = state.favorites.length;
  const likesCast = state.likes.length;
  const totalComments = Object.values(state.comments).reduce(
    (sum, commentList) => sum + (Array.isArray(commentList) ? commentList.length : 0),
    0
  );
  const lastActivity = state.activity[0]?.timestamp ?? null;
  return { totalFavorites, likesCast, totalComments, lastActivity };
}

function getCommentsForBook(bookId) {
  const comments = state.comments[bookId];
  return Array.isArray(comments) ? comments : [];
}

function getCommentsGroupedByBook() {
  return Object.entries(state.comments)
    .filter(([bookId, comments]) => isKnownBook(bookId) && Array.isArray(comments) && comments.length)
    .map(([bookId, comments]) => ({
      book: BOOK_LOOKUP.get(bookId),
      comments,
    }));
}

function getRecentComments(limit = 5) {
  const entries = [];
  Object.entries(state.comments).forEach(([bookId, list]) => {
    if (!isKnownBook(bookId) || !Array.isArray(list)) return;
    list.forEach((comment) => {
      entries.push({ ...comment, bookId });
    });
  });
  return entries
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

function getRecentActivity(limit = 5) {
  return state.activity.slice(0, limit);
}

function describeActivity(entry) {
  const book = entry.bookId ? BOOK_LOOKUP.get(entry.bookId) : null;
  const title = book ? `"${book.title}"` : "a book";
  switch (entry.type) {
    case "favorite_added":
      return `Added ${title} to favorites.`;
    case "favorite_removed":
      return `Removed ${title} from favorites.`;
    case "like_added":
      return `Liked ${title}.`;
    case "like_removed":
      return `Unliked ${title}.`;
    case "comment_added":
      return `Commented on ${title}: ${truncate(entry.detail ?? "", 80)}`;
    case "comment_removed":
      return `Deleted a comment from ${title}.`;
    default:
      return "Interaction recorded.";
  }
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = Date.now();
  const value = date.getTime();
  if (Number.isNaN(value)) return "";
  const diff = value - now;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const deltaMinutes = Math.round(diff / (60 * 1000));
  const deltaHours = Math.round(diff / (60 * 60 * 1000));
  const deltaDays = Math.round(diff / (24 * 60 * 60 * 1000));
  const deltaWeeks = Math.round(diff / (7 * 24 * 60 * 60 * 1000));

  if (Math.abs(deltaMinutes) < 1) return "just now";
  if (Math.abs(deltaMinutes) < 60) return rtf.format(deltaMinutes, "minute");
  if (Math.abs(deltaHours) < 24) return rtf.format(deltaHours, "hour");
  if (Math.abs(deltaDays) < 7) return rtf.format(deltaDays, "day");
  return rtf.format(deltaWeeks, "week");
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function focusMain() {
  if (!appRoot) return;
  requestAnimationFrame(() => {
    appRoot.focus({ preventScroll: true });
  });
}
