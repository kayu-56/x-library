// LocalStorage utilities for likes, saves, and comments
// Keys
const USER_KEY = 'll_user';
const COUNTS_KEY = 'll_counts';
const USER_ACTIONS_KEY = 'll_user_actions';
const COMMENTS_KEY = 'll_comments';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function getCurrentUser() {
  const existing = safeParse(localStorage.getItem(USER_KEY), null);
  if (existing && existing.id) return existing;
  const user = { id: 'user-1', name: 'You' };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

function readCounts() {
  return safeParse(localStorage.getItem(COUNTS_KEY), {});
}

function writeCounts(obj) {
  localStorage.setItem(COUNTS_KEY, JSON.stringify(obj));
}

export function ensureCounts(bookId, defaults = { likes: 0, saves: 0 }) {
  const counts = readCounts();
  if (!counts[bookId]) {
    counts[bookId] = { likes: defaults.likes || 0, saves: defaults.saves || 0 };
    writeCounts(counts);
  }
  return counts[bookId];
}

export function getCounts(bookId) {
  const counts = readCounts();
  return counts[bookId] || { likes: 0, saves: 0 };
}

export function setCounts(bookId, next) {
  const counts = readCounts();
  counts[bookId] = { likes: Math.max(0, next.likes || 0), saves: Math.max(0, next.saves || 0) };
  writeCounts(counts);
  return counts[bookId];
}

function readUserActions() {
  return safeParse(localStorage.getItem(USER_ACTIONS_KEY), {});
}

function writeUserActions(obj) {
  localStorage.setItem(USER_ACTIONS_KEY, JSON.stringify(obj));
}

export function getUserActionsForBook(bookId) {
  const user = getCurrentUser();
  const all = readUserActions();
  const userMap = all[user.id] || {};
  return userMap[bookId] || { liked: false, saved: false };
}

export function setUserActionsForBook(bookId, state) {
  const user = getCurrentUser();
  const all = readUserActions();
  if (!all[user.id]) all[user.id] = {};
  all[user.id][bookId] = { liked: !!state.liked, saved: !!state.saved };
  writeUserActions(all);
  return all[user.id][bookId];
}

export function toggleLike(bookId) {
  const userState = getUserActionsForBook(bookId);
  const counts = getCounts(bookId);
  const liked = !userState.liked;
  const nextCounts = { ...counts, likes: Math.max(0, counts.likes + (liked ? 1 : -1)) };
  setCounts(bookId, nextCounts);
  setUserActionsForBook(bookId, { ...userState, liked });
  return { liked, counts: nextCounts };
}

export function toggleSave(bookId) {
  const userState = getUserActionsForBook(bookId);
  const counts = getCounts(bookId);
  const saved = !userState.saved;
  const nextCounts = { ...counts, saves: Math.max(0, counts.saves + (saved ? 1 : -1)) };
  setCounts(bookId, nextCounts);
  setUserActionsForBook(bookId, { ...userState, saved });
  return { saved, counts: nextCounts };
}

function readComments() {
  return safeParse(localStorage.getItem(COMMENTS_KEY), {});
}

function writeComments(obj) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(obj));
}

export function getComments(bookId) {
  const all = readComments();
  const list = all[bookId] || [];
  // Sort newest first
  return [...list].sort((a, b) => b.createdAt - a.createdAt);
}

export function addComment(bookId, content) {
  const all = readComments();
  const user = getCurrentUser();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content: content.trim(),
    authorId: user.id,
    authorName: user.name,
    createdAt: Date.now(),
    updatedAt: null,
  };
  const list = all[bookId] || [];
  all[bookId] = [entry, ...list];
  writeComments(all);
  return entry;
}

export function updateComment(bookId, commentId, nextContent) {
  const all = readComments();
  const list = all[bookId] || [];
  const idx = list.findIndex((c) => c.id === commentId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], content: nextContent.trim(), updatedAt: Date.now() };
  all[bookId] = list;
  writeComments(all);
  return list[idx];
}

export function deleteComment(bookId, commentId) {
  const all = readComments();
  const list = all[bookId] || [];
  all[bookId] = list.filter((c) => c.id !== commentId);
  writeComments(all);
  return true;
}
