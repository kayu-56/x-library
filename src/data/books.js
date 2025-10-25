// Legacy compatibility layer - redirects to new data service
// This file is kept for backward compatibility during migration
// New code should import from '../services/bookService.js' instead

import bookDataService from '../services/bookService.js';

// Export the books array for backward compatibility
export const books = bookDataService.getAllBooks();

// Export functions for backward compatibility
export function getBookById(id) {
  return bookDataService.getBookById(id);
}

export function getRelatedBooks(book, limit = 3) {
  return bookDataService.getRelatedBooks(book, limit);
}
