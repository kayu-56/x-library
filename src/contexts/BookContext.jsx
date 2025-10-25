import React, { useState, useEffect, useCallback } from 'react';
import bookDataService from '../services/bookService.js';
import { BookContext } from './BookContextBase.jsx';

// Provider component
export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    subject: 'All',
    search: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Load books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const allBooks = bookDataService.getAllBooks();
        setBooks(allBooks);
        setError(null);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Update filtered books when filters or books change
  useEffect(() => {
    if (books.length > 0) {
      const filtered = bookDataService.getFilteredBooks(filters);
      setFilteredBooks(filtered);
    }
  }, [books, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: 'All',
      subject: 'All',
      search: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
  }, []);

  // Get book by ID
  const getBookById = useCallback((id) => {
    return bookDataService.getBookById(id);
  }, []);

  // Get related books
  const getRelatedBooks = useCallback((book, limit = 6) => {
    return bookDataService.getRelatedBooks(book, limit);
  }, []);

  // Get popular books
  const getPopularBooks = useCallback((limit = 10) => {
    return bookDataService.getPopularBooks(limit);
  }, []);

  // Get recent books
  const getRecentBooks = useCallback((limit = 10) => {
    return bookDataService.getRecentBooks(limit);
  }, []);

  // Get categories
  const getCategories = useCallback(() => {
    return bookDataService.getCategories();
  }, []);

  // Get subjects
  const getSubjects = useCallback(() => {
    return bookDataService.getSubjects();
  }, []);

  // Get subjects by category
  const getSubjectsByCategory = useCallback((category) => {
    return bookDataService.getSubjectsByCategory(category);
  }, []);

  // Get statistics
  const getStatistics = useCallback(() => {
    return bookDataService.getStatistics();
  }, []);

  // Search books
  const searchBooks = useCallback((query) => {
    return bookDataService.searchBooks(query);
  }, []);

  // Filter by category
  const filterByCategory = useCallback((category) => {
    return bookDataService.filterByCategory(category);
  }, []);

  // Filter by subject
  const filterBySubject = useCallback((subject) => {
    return bookDataService.filterBySubject(subject);
  }, []);

  const value = {
    // Data
    books,
    filteredBooks,
    loading,
    error,
    filters,
    
    // Actions
    updateFilters,
    resetFilters,
    
    // Helper functions
    getBookById,
    getRelatedBooks,
    getPopularBooks,
    getRecentBooks,
    getCategories,
    getSubjects,
    getSubjectsByCategory,
    getStatistics,
    searchBooks,
    filterByCategory,
    filterBySubject
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}

// Export the context for advanced usage
export { BookContext } from './BookContextBase.jsx';