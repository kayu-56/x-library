# Data Architecture Documentation

This document outlines the data structures, storage mechanisms, and API interfaces used in the Leafline Library application.

## Table of Contents

1. [Book Data Schema](#book-data-schema)
2. [Storage Keys and Structure](#storage-keys-and-structure)
3. [Data Service API](#data-service-api)
4. [React Context and Hooks](#react-context-and-hooks)
5. [User Data Management](#user-data-management)
6. [Data Flow Diagram](#data-flow-diagram)

## Book Data Schema

### Book Object Structure

```javascript
{
  id: string,                    // Unique identifier (URL-friendly slug)
  title: string,                 // Book title
  author: string,                // Author name
  description: string,           // Book description/summary
  publicationDate: string,       // ISO date string (YYYY-MM-DD)
  subject: string,               // Specific subject/topic
  category: string,              // Broad category (Philosophy, Programming, Humanities & Social Sciences)
  readingTime: string,           // Estimated reading time (e.g., "6.5 hours")
  likes: number,                 // Global like count
  saves: number                  // Global save count
}
```

### Categories

- `Philosophy` - Books related to philosophical thought, ethics, metaphysics, etc.
- `Programming` - Technical books about software development, computer science, etc.
- `Humanities & Social Sciences` - Books about sociology, psychology, history, etc.

### Example Book Entry

```javascript
{
  "id": "ethics-of-artificial-consciousness",
  "title": "The Ethics of Artificial Consciousness",
  "author": "Dr. Sarah Chen",
  "description": "A comprehensive exploration of AI ethics that challenges conventional wisdom and offers fresh perspectives on contemporary issues.",
  "publicationDate": "2023-03-15",
  "subject": "Ethics",
  "category": "Philosophy",
  "readingTime": "7.5 hours",
  "likes": 42,
  "saves": 18
}
```

## Storage Keys and Structure

All data is stored in localStorage using the following key structure:

### Core Storage Keys

| Key | Purpose | Data Structure |
|-----|---------|----------------|
| `ll_user` | Current user information | `{ id: string, name: string }` |
| `ll_counts` | Global like/save counts per book | `{ [bookId]: { likes: number, saves: number } }` |
| `ll_user_actions` | Per-user interaction states | `{ [userId]: { [bookId]: { liked: boolean, saved: boolean, favorited: boolean } } }` |
| `ll_comments` | Comments per book | `{ [bookId]: Comment[] }` |
| `ll_favorites` | User favorite books (separate from actions) | `{ [userId]: string[] }` |

### Comment Object Structure

```javascript
{
  id: string,                   // Unique comment ID
  content: string,              // Comment text
  authorId: string,             // ID of the comment author
  authorName: string,           // Name of the comment author
  createdAt: number,            // Unix timestamp
  updatedAt: number \| null     // Unix timestamp of last edit (null if never edited)
}
```

## Data Service API

The `bookDataService` provides the following methods:

### Core Data Access

- `getAllBooks()` - Returns all books
- `getBookById(id)` - Returns a single book by ID
- `getCategories()` - Returns all available categories
- `getSubjects()` - Returns all available subjects
- `getSubjectsByCategory(category)` - Returns subjects for a specific category

### Filtering and Search

- `filterByCategory(category)` - Filter books by category
- `filterBySubject(subject)` - Filter books by subject
- `searchBooks(query)` - Search books by title, author, description, or subject
- `getFilteredBooks(filters)` - Advanced filtering with multiple criteria

### Sorting and Recommendations

- `getRelatedBooks(book, limit)` - Get related books based on category/subject
- `getPopularBooks(limit)` - Get books with highest engagement
- `getRecentBooks(limit)` - Get most recently published books

### Analytics

- `getStatistics()` - Get collection statistics (counts, categories, subjects, engagement)

### Filter Object Structure

```javascript
{
  category: string,     // 'All' or specific category
  subject: string,      // 'All' or specific subject
  search: string,       // Search query
  sortBy: string,       // 'title', 'author', 'publicationDate', 'likes', 'saves'
  sortOrder: string     // 'asc' or 'desc'
}
```

## React Context and Hooks

### BookContext

Provides global book data and filtering state to the entire application.

```javascript
const value = {
  // Data
  books: Book[],              // All books
  filteredBooks: Book[],      // Currently filtered/sorted books
  loading: boolean,           // Loading state
  error: string \| null,      // Error message
  filters: FilterObject,      // Current filter state
  
  // Actions
  updateFilters: Function,    // Update filter criteria
  resetFilters: Function,     // Reset all filters
  
  // Helper functions
  getBookById: Function,
  getRelatedBooks: Function,
  getPopularBooks: Function,
  getRecentBooks: Function,
  getCategories: Function,
  getSubjects: Function,
  getSubjectsByCategory: Function,
  getStatistics: Function,
  searchBooks: Function,
  filterByCategory: Function,
  filterBySubject: Function
};
```

### Custom Hooks

#### `useBook(bookId)`
Manages a single book's data and related books.

```javascript
const { book, relatedBooks, loading, error } = useBook(bookId);
```

#### `useBookInteractions(bookId)`
Manages user interactions (likes, saves, favorites) with a specific book.

```javascript
const { 
  userActions,           // { liked: boolean, saved: boolean, favorited: boolean }
  counts,                // { likes: number, saves: number }
  loading,
  toggleLike,            // () => { liked: boolean, counts: CountsObject }
  toggleSave,            // () => { saved: boolean, counts: CountsObject }
  toggleFavorite,        // () => { favorited: boolean }
  setUserAction          // (action: string, value: boolean) => void
} = useBookInteractions(bookId);
```

#### `useBookComments(bookId)`
Manages comments for a specific book.

```javascript
const {
  comments: Comment[],   // Sorted by newest first
  loading,
  addComment: (content: string) => Comment,
  updateComment: (id: string, content: string) => Comment \| null,
  deleteComment: (id: string) => boolean
} = useBookComments(bookId);
```

#### `useBookFilters()`
Manages book filtering and search functionality.

```javascript
const {
  filters,               // Current filter state
  filteredBooks,         // Filtered results
  availableSubjects,     // Subjects available for current category
  setCategory,           // (category: string) => void
  setSubject,            // (subject: string) => void
  setSearchQuery,        // (query: string) => void
  setSorting,            // (sortBy: string, sortOrder?: string) => void
  clearFilters,          // () => void
  categories,            // All available categories
  subjects               // All available subjects
} = useBookFilters();
```

#### `useBookStatistics()`
Provides collection statistics.

```javascript
const { stats, loading } = useBookStatistics();
```

#### `useUserSavedBooks()` & `useUserFavoriteBooks()`
Get user's saved and favorite books.

```javascript
const { savedBooks, loading } = useUserSavedBooks();
const { favoriteBooks, loading } = useUserFavoriteBooks();
```

## User Data Management

### Storage Utilities

#### Core Functions
- `getCurrentUser()` - Get or create current user
- `getUserActionsForBook(bookId)` - Get user's interaction state for a book
- `setUserActionsForBook(bookId, state)` - Set user's interaction state
- `getCounts(bookId)` - Get global like/save counts
- `setCounts(bookId, counts)` - Set global like/save counts

#### Interaction Functions
- `toggleLike(bookId)` - Toggle like state and update counts
- `toggleSave(bookId)` - Toggle save state and update counts
- `toggleFavorite(bookId)` - Toggle favorite state

#### Comment Functions
- `getComments(bookId)` - Get comments for a book
- `addComment(bookId, content)` - Add a new comment
- `updateComment(bookId, commentId, content)` - Update existing comment
- `deleteComment(bookId, commentId)` - Delete a comment

#### Data Management Functions
- `hydrateUserData(bookIds)` - Preload user data for multiple books
- `exportUserData()` - Export all user data for backup
- `importUserData(data)` - Import user data from backup

### Data Hydration

On app initialization, use `hydrateUserData()` to preload user data:

```javascript
import { hydrateUserData } from '../utils/storage.js';

// Hydrate data for currently visible books
const bookIds = ['book-1', 'book-2', 'book-3'];
const userData = hydrateUserData(bookIds);
```

## Data Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   books.json    │    │  bookService.js  │    │  BookContext    │
│   (1000 books)  │───▶│  (Data Service)  │───▶│  (React State)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │  localStorage    │◄────────────┤
                       │  (User Data)     │             │
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │  Custom Hooks   │◄────────────┘
                       │  (useBooks.js)  │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │  Components     │
                       │  (UI Layer)     │
                       └─────────────────┘
```

## Performance Considerations

### Data Loading
- Books are loaded once from JSON and cached in memory
- User data is loaded on-demand and cached in React state
- Filtered results are computed reactively based on filter changes

### Storage Optimization
- localStorage is used for persistence (limited to ~5MB)
- User actions are stored efficiently using nested objects
- Comments are stored per-book to minimize data transfer

### Memory Management
- Book data is immutable and shared across components
- Filter operations use pure functions for optimal performance
- Large datasets are handled through pagination or virtual scrolling when needed

## Migration and Backup

### Data Export
```javascript
import { exportUserData } from '../utils/storage.js';

const userData = exportUserData();
// userData contains: user, actions, favorites, comments, timestamp
```

### Data Import
```javascript
import { importUserData } from '../utils/storage.js';

try {
  importUserData(userData);
  console.log('User data imported successfully');
} catch (error) {
  console.error('Import failed:', error);
}
```

## Error Handling

All async operations include proper error handling:
- Network failures for data loading
- Storage quota exceeded for localStorage
- Invalid data formats for import/export
- Missing or corrupted data structures

## Security Considerations

- All user data is stored locally (client-side only)
- No sensitive information is stored in localStorage
- Data validation is performed on all imports
- User IDs are generated client-side and are not shared across devices