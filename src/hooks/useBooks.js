import { useCallback, useEffect, useState } from 'react';
import { useBooks } from './useBookContext.js';
import { 
  getUserActionsForBook, 
  setUserActionsForBook,
  getCounts,
  toggleLike,
  toggleSave,
  toggleFavorite,
  getComments,
  addComment,
  updateComment,
  deleteComment
} from '../utils/storage.js';

/**
 * Custom hook for managing a single book's data and user interactions
 * @param {string} bookId - The ID of the book
 * @returns {Object} Book data and interaction methods
 */
export function useBook(bookId) {
  const { getBookById, getRelatedBooks } = useBooks();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = () => {
      try {
        setLoading(true);
        const bookData = getBookById(bookId);
        
        if (!bookData) {
          setError('Book not found');
          setBook(null);
          setRelatedBooks([]);
        } else {
          setBook(bookData);
          setRelatedBooks(getRelatedBooks(bookData, 6));
          setError(null);
        }
      } catch (err) {
        setError('Failed to load book');
        console.error('Error loading book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId, getBookById, getRelatedBooks]);

  return {
    book,
    relatedBooks,
    loading,
    error
  };
}

/**
 * Custom hook for managing user interactions with books
 * @param {string} bookId - The ID of the book
 * @returns {Object} User interaction state and methods
 */
export function useBookInteractions(bookId) {
  const [userActions, setUserActions] = useState({ liked: false, saved: false, favorited: false });
  const [counts, setCounts] = useState({ likes: 0, saves: 0 });
  const [loading, setLoading] = useState(true);

  // Load initial state
  useEffect(() => {
    if (bookId) {
      const actions = getUserActionsForBook(bookId);
      const bookCounts = getCounts(bookId);
      setUserActions(actions);
      setCounts(bookCounts);
      setLoading(false);
    }
  }, [bookId]);

  // Toggle like
  const handleToggleLike = useCallback(() => {
    if (!bookId) return null;
    
    const result = toggleLike(bookId);
    setUserActions(prev => ({ ...prev, liked: result.liked }));
    setCounts(result.counts);
    return result;
  }, [bookId]);

  // Toggle save
  const handleToggleSave = useCallback(() => {
    if (!bookId) return null;
    
    const result = toggleSave(bookId);
    setUserActions(prev => ({ ...prev, saved: result.saved }));
    setCounts(result.counts);
    return result;
  }, [bookId]);

  // Toggle favorite
  const handleToggleFavorite = useCallback(() => {
    if (!bookId) return null;
    
    const result = toggleFavorite(bookId);
    setUserActions(prev => ({ ...prev, favorited: result.favorited }));
    return result;
  }, [bookId]);

  // Set user actions directly
  const setUserAction = useCallback((action, value) => {
    if (!bookId) return null;
    
    const newActions = { ...userActions, [action]: value };
    const result = setUserActionsForBook(bookId, newActions);
    setUserActions(result);
    return result;
  }, [bookId, userActions]);

  return {
    userActions,
    counts,
    loading,
    toggleLike: handleToggleLike,
    toggleSave: handleToggleSave,
    toggleFavorite: handleToggleFavorite,
    setUserAction
  };
}

/**
 * Custom hook for managing book comments
 * @param {string} bookId - The ID of the book
 * @returns {Object} Comments state and CRUD methods
 */
export function useBookComments(bookId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load comments
  useEffect(() => {
    if (bookId) {
      const bookComments = getComments(bookId);
      setComments(bookComments);
      setLoading(false);
    }
  }, [bookId]);

  // Add comment
  const addCommentHandler = useCallback((content) => {
    if (!bookId || !content?.trim()) return null;
    
    const newComment = addComment(bookId, content);
    setComments(prev => [newComment, ...prev]);
    return newComment;
  }, [bookId]);

  // Update comment
  const updateCommentHandler = useCallback((commentId, newContent) => {
    if (!bookId || !commentId || !newContent?.trim()) return null;
    
    const updatedComment = updateComment(bookId, commentId, newContent);
    if (updatedComment) {
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
    }
    return updatedComment;
  }, [bookId]);

  // Delete comment
  const deleteCommentHandler = useCallback((commentId) => {
    if (!bookId || !commentId) return false;
    
    const success = deleteComment(bookId, commentId);
    if (success) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
    return success;
  }, [bookId]);

  return {
    comments,
    loading,
    addComment: addCommentHandler,
    updateComment: updateCommentHandler,
    deleteComment: deleteCommentHandler
  };
}

/**
 * Custom hook for managing book filters and search
 * @returns {Object} Filter state and methods
 */
export function useBookFilters() {
  const { filters, updateFilters, resetFilters, filteredBooks, getCategories, getSubjects, getSubjectsByCategory } = useBooks();
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // Update available subjects when category changes
  useEffect(() => {
    if (filters.category === 'All') {
      setAvailableSubjects(getSubjects());
    } else {
      setAvailableSubjects(getSubjectsByCategory(filters.category));
    }
  }, [filters.category, getSubjects, getSubjectsByCategory]);

  // Update category filter
  const setCategory = useCallback((category) => {
    updateFilters({ category, subject: 'All' }); // Reset subject when category changes
  }, [updateFilters]);

  // Update subject filter
  const setSubject = useCallback((subject) => {
    updateFilters({ subject });
  }, [updateFilters]);

  // Update search query
  const setSearchQuery = useCallback((search) => {
    updateFilters({ search });
  }, [updateFilters]);

  // Update sorting
  const setSorting = useCallback((sortBy, sortOrder = 'asc') => {
    updateFilters({ sortBy, sortOrder });
  }, [updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  return {
    // Current filter state
    filters,
    filteredBooks,
    availableSubjects,
    
    // Filter methods
    setCategory,
    setSubject,
    setSearchQuery,
    setSorting,
    clearFilters,
    updateFilters,
    
    // Available options
    categories: getCategories(),
    subjects: getSubjects()
  };
}

/**
 * Custom hook for getting book statistics
 * @returns {Object} Book collection statistics
 */
export function useBookStatistics() {
  const { getStatistics } = useBooks();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        const bookStats = getStatistics();
        setStats(bookStats);
      } catch (err) {
        console.error('Error loading statistics:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [getStatistics]);

  return { stats, loading };
}

/**
 * Custom hook for getting user's favorite/saved books
 * @returns {Object} User's saved books and methods
 */
export function useUserSavedBooks() {
  const { books } = useBooks();
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedBooks = () => {
      try {
        const saved = books.filter(book => {
          const actions = getUserActionsForBook(book.id);
          return actions.saved;
        });
        setSavedBooks(saved);
      } catch (err) {
        console.error('Error loading saved books:', err);
        setSavedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (books.length > 0) {
      loadSavedBooks();
    }
  }, [books]);

  return { savedBooks, loading };
}

/**
 * Custom hook for getting user's favorite books
 * @returns {Object} User's favorite books and methods
 */
export function useUserFavoriteBooks() {
  const { books } = useBooks();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteBooks = () => {
      try {
        const favorites = books.filter(book => {
          const actions = getUserActionsForBook(book.id);
          return actions.favorited;
        });
        setFavoriteBooks(favorites);
      } catch (err) {
        console.error('Error loading favorite books:', err);
        setFavoriteBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (books.length > 0) {
      loadFavoriteBooks();
    }
  }, [books]);

  return { favoriteBooks, loading };
}