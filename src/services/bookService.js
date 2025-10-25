import booksData from '../data/books.json';

class BookDataService {
  constructor() {
    this.books = booksData;
    this.categories = ['Philosophy', 'Programming', 'Humanities & Social Sciences'];
    this.subjects = this.extractSubjects();
  }

  extractSubjects() {
    const subjects = new Set();
    this.books.forEach(book => subjects.add(book.subject));
    return Array.from(subjects).sort();
  }

  /**
   * Get all books
   * @returns {Array} Array of all books
   */
  getAllBooks() {
    return this.books;
  }

  /**
   * Get a book by its ID
   * @param {string} id - The book ID
   * @returns {Object|null} The book object or null if not found
   */
  getBookById(id) {
    return this.books.find(book => book.id === id) || null;
  }

  /**
   * Filter books by category
   * @param {string} category - The category to filter by
   * @returns {Array} Array of books in the specified category
   */
  filterByCategory(category) {
    if (!category || category === 'All') return this.books;
    return this.books.filter(book => book.category === category);
  }

  /**
   * Filter books by subject
   * @param {string} subject - The subject to filter by
   * @returns {Array} Array of books in the specified subject
   */
  filterBySubject(subject) {
    if (!subject || subject === 'All') return this.books;
    return this.books.filter(book => book.subject === subject);
  }

  /**
   * Search books by title, author, or description
   * @param {string} query - The search query
   * @returns {Array} Array of books matching the search query
   */
  searchBooks(query) {
    if (!query || query.trim() === '') return this.books;
    
    const searchTerm = query.toLowerCase().trim();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.description.toLowerCase().includes(searchTerm) ||
      book.subject.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get books with advanced filtering
   * @param {Object} filters - Filter options
   * @param {string} filters.category - Category filter
   * @param {string} filters.subject - Subject filter
   * @param {string} filters.search - Search query
   * @param {string} filters.sortBy - Sort field (title, author, publicationDate, likes, saves)
   * @param {string} filters.sortOrder - Sort order (asc, desc)
   * @returns {Array} Filtered and sorted array of books
   */
  getFilteredBooks(filters = {}) {
    let result = [...this.books];

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(book => book.category === filters.category);
    }

    // Apply subject filter
    if (filters.subject && filters.subject !== 'All') {
      result = result.filter(book => book.subject === filters.subject);
    }

    // Apply search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm) ||
        book.subject.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        // Handle string comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return -sortOrder;
        if (aValue > bValue) return sortOrder;
        return 0;
      });
    }

    return result;
  }

  /**
   * Get related books based on category or subject
   * @param {Object} book - The reference book
   * @param {number} limit - Maximum number of related books to return
   * @returns {Array} Array of related books
   */
  getRelatedBooks(book, limit = 6) {
    if (!book) return [];

    // First try to find books in the same category
    let related = this.books.filter(b => 
      b.category === book.category && b.id !== book.id
    );

    // If not enough books from same category, add books from same subject
    if (related.length < limit) {
      const subjectBooks = this.books.filter(b => 
        b.subject === book.subject && 
        b.id !== book.id && 
        !related.some(r => r.id === b.id)
      );
      related = [...related, ...subjectBooks];
    }

    // Shuffle and limit the results
    related = related.sort(() => Math.random() - 0.5);
    return related.slice(0, limit);
  }

  /**
   * Get popular books based on likes and saves
   * @param {number} limit - Maximum number of books to return
   * @returns {Array} Array of popular books
   */
  getPopularBooks(limit = 10) {
    return [...this.books]
      .sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves))
      .slice(0, limit);
  }

  /**
   * Get recently published books
   * @param {number} limit - Maximum number of books to return
   * @returns {Array} Array of recently published books
   */
  getRecentBooks(limit = 10) {
    return [...this.books]
      .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
      .slice(0, limit);
  }

  /**
   * Get all available categories
   * @returns {Array} Array of category names
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get all available subjects
   * @returns {Array} Array of subject names
   */
  getSubjects() {
    return this.subjects;
  }

  /**
   * Get subjects by category
   * @param {string} category - The category to filter subjects by
   * @returns {Array} Array of subject names for the specified category
   */
  getSubjectsByCategory(category) {
    if (!category || category === 'All') return this.subjects;
    
    const subjects = new Set();
    this.books
      .filter(book => book.category === category)
      .forEach(book => subjects.add(book.subject));
    
    return Array.from(subjects).sort();
  }

  /**
   * Get statistics about the book collection
   * @returns {Object} Statistics object
   */
  getStatistics() {
    const stats = {
      totalBooks: this.books.length,
      categories: {},
      subjects: {},
      totalLikes: 0,
      totalSaves: 0
    };

    this.books.forEach(book => {
      // Category stats
      if (!stats.categories[book.category]) {
        stats.categories[book.category] = 0;
      }
      stats.categories[book.category]++;

      // Subject stats
      if (!stats.subjects[book.subject]) {
        stats.subjects[book.subject] = 0;
      }
      stats.subjects[book.subject]++;

      // Engagement stats
      stats.totalLikes += book.likes;
      stats.totalSaves += book.saves;
    });

    return stats;
  }
}

// Create a singleton instance
const bookDataService = new BookDataService();

export default bookDataService;

// Export individual functions for convenience
export const {
  getAllBooks,
  getBookById,
  filterByCategory,
  filterBySubject,
  searchBooks,
  getFilteredBooks,
  getRelatedBooks,
  getPopularBooks,
  getRecentBooks,
  getCategories,
  getSubjects,
  getSubjectsByCategory,
  getStatistics
} = bookDataService;