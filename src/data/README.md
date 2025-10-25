# Mock Book Dataset and Client-Side Data Layers

This directory contains the complete implementation of the mock book dataset and client-side data layers for the Leafline Library application.

## Overview

The implementation includes:

1. **Mock Dataset Generation** - A Node.js script that generates 1,000 realistic book entries
2. **Data Service Layer** - A service class for managing book data operations
3. **React Context & Hooks** - State management for the book catalog
4. **LocalStorage Utilities** - Persistent storage for user interactions
5. **Comprehensive Documentation** - Complete API documentation and usage examples

## File Structure

```
src/
├── data/
│   ├── books.json              # Generated mock dataset (1,000 books)
│   └── books.js                # Legacy compatibility layer
├── services/
│   └── bookService.js          # Data service with helper functions
├── contexts/
│   └── BookContext.jsx         # React context for book data
├── hooks/
│   └── useBooks.js             # Custom hooks for book operations
├── utils/
│   └── storage.js              # Enhanced localStorage utilities
├── components/
│   └── BookCatalogExample.jsx  # Example component demonstrating usage
└── docs/
    └── data-architecture.md    # Complete documentation

scripts/
└── generate-books.js           # Script to generate mock dataset
```

## Quick Start

### 1. Generate the Mock Dataset

```bash
node scripts/generate-books.js
```

This creates `src/data/books.json` with 1,000 books distributed across:
- Philosophy: 334 books
- Programming: 333 books  
- Humanities & Social Sciences: 333 books

### 2. Use in Your Components

```jsx
import React from 'react';
import { useBooks, useBookFilters } from '../hooks/useBooks.js';

function MyBookComponent() {
  const { loading, error, books } = useBooks();
  const { filteredBooks, setCategory, setSearchQuery } = useBookFilters();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input 
        placeholder="Search books..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All Categories</option>
        <option value="Philosophy">Philosophy</option>
        <option value="Programming">Programming</option>
        <option value="Humanities & Social Sciences">Humanities</option>
      </select>
      
      {filteredBooks.map(book => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. User Interactions

```jsx
import { useBookInteractions } from '../hooks/useBooks.js';

function BookInteraction({ bookId }) {
  const { 
    userActions, 
    counts, 
    toggleLike, 
    toggleSave, 
    toggleFavorite 
  } = useBookInteractions(bookId);

  return (
    <div>
      <button onClick={toggleLike}>
        {userActions.liked ? '❤️' : '🤍'} {counts.likes}
      </button>
      <button onClick={toggleSave}>
        {userActions.saved ? '🔖' : '📄'} {counts.saves}
      </button>
      <button onClick={toggleFavorite}>
        {userActions.favorited ? '⭐' : '☆'}
      </button>
    </div>
  );
}
```

## Key Features

### Data Service (`bookService.js`)
- ** getAllBooks()** - Get all books
- ** getBookById(id)** - Get single book
- ** filterByCategory(category)** - Filter by category
- ** searchBooks(query)** - Search across titles, authors, descriptions
- ** getFilteredBooks(filters)** - Advanced filtering with sorting
- ** getRelatedBooks(book, limit)** - Get related books
- ** getPopularBooks(limit)** - Get most engaging books
- ** getStatistics()** - Collection analytics

### React Context (`BookContext.jsx`)
- Global state management for book data
- Automatic loading states and error handling
- Reactive filtering and search
- Memory-efficient data caching

### Custom Hooks (`useBooks.js`)
- ** useBook(bookId)** - Single book management
- ** useBookInteractions(bookId)** - Like/save/favorite interactions
- ** useBookComments(bookId)** - Comment CRUD operations
- ** useBookFilters()** - Advanced filtering controls
- ** useUserFavoriteBooks()** - User's favorite books

### Storage Utilities (`storage.js`)
- ** localStorage-backed persistence**
- ** User management** with automatic user creation
- ** Like/Save/Favorite tracking** with global counts
- ** Comment system** with CRUD operations
- ** Data hydration** for performance
- ** Import/Export** for backup/restore

## Data Schema

### Book Object
```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Book title
  author: string,                // Author name
  description: string,           // Book description
  publicationDate: string,       // ISO date (YYYY-MM-DD)
  subject: string,               // Specific subject
  category: string,              // Broad category
  readingTime: string,           // Estimated reading time
  likes: number,                 // Global like count
  saves: number                  // Global save count
}
```

### User Actions
```javascript
{
  liked: boolean,        // User has liked the book
  saved: boolean,        // User has saved the book
  favorited: boolean     // User has favorited the book
}
```

### Comment Object
```javascript
{
  id: string,           // Unique comment ID
  content: string,       // Comment text
  authorId: string,      // Author user ID
  authorName: string,    // Author display name
  createdAt: number,     // Unix timestamp
  updatedAt: number      // Last edit timestamp (null if never edited)
}
```

## Storage Keys

| Key | Purpose | Structure |
|-----|---------|-----------|
| `ll_user` | Current user | `{ id: string, name: string }` |
| `ll_counts` | Global counts | `{ [bookId]: { likes: number, saves: number } }` |
| `ll_user_actions` | User interactions | `{ [userId]: { [bookId]: UserActions } }` |
| `ll_comments` | Comments | `{ [bookId]: Comment[] }` |
| `ll_favorites` | Favorites | `{ [userId]: string[] }` |

## Performance Optimizations

1. **Lazy Loading** - User data loaded on-demand
2. **Memoization** - Filter results cached until dependencies change
3. **Efficient Storage** - Nested localStorage structure for minimal parsing
4. **Reactive Updates** - Only recompute when filters actually change
5. **Memory Management** - Immutable data structures for React optimization

## Error Handling

- Network failures for data loading
- Storage quota exceeded handling
- Invalid data validation
- Graceful degradation for missing data
- User-friendly error messages

## Browser Support

- Modern browsers with ES6+ support
- localStorage capability required
- React 18+ for concurrent features
- Works offline (once data is loaded)

## Development

### Adding New Books

1. Update the generation script with new titles/authors
2. Run `node scripts/generate-books.js`
3. The new books will be automatically available

### Extending the Schema

1. Update the book object structure in the generation script
2. Update the Book interface in documentation
3. Add new filters/search options as needed
4. Update storage utilities if adding new user interactions

### Adding New Categories

1. Add to the categories array in `bookService.js`
2. Update the generation script with new category data
3. Regenerate the dataset

For complete API documentation, see `docs/data-architecture.md`.