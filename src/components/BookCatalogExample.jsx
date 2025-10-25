import React from 'react';
import { useBooks } from '../hooks/useBookContext.js';
import { useBookFilters } from '../hooks/useBooks.js';

/**
 * Example component demonstrating the book data layer usage
 * This component shows how to use the context and hooks for book management
 */
function BookCatalogExample() {
  const { loading, error, getPopularBooks, getStatistics } = useBooks();
  const { 
    filteredBooks, 
    filters, 
    setCategory, 
    setSubject, 
    setSearchQuery,
    categories,
    availableSubjects
  } = useBookFilters();

  if (loading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const popularBooks = getPopularBooks(5);
  const stats = getStatistics();

  return (
    <div className="book-catalog-example">
      <h2>Book Catalog Example</h2>
      
      {/* Statistics */}
      <div className="stats">
        <h3>Library Statistics</h3>
        <p>Total Books: {stats?.totalBooks}</p>
        <div className="category-stats">
          {Object.entries(stats?.categories || {}).map(([category, count]) => (
            <span key={category} className="category-stat">
              {category}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Popular Books */}
      <div className="popular-books">
        <h3>Popular Books</h3>
        <div className="book-grid">
          {popularBooks.map(book => (
            <div key={book.id} className="book-card">
              <h4>{book.title}</h4>
              <p>by {book.author}</p>
              <p>{book.category} - {book.subject}</p>
              <p>❤️ {book.likes} 🔖 {book.saves}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <h3>Filters</h3>
        <div className="filter-controls">
          <div>
            <label>Category:</label>
            <select 
              value={filters.category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label>Subject:</label>
            <select 
              value={filters.subject} 
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label>Search:</label>
            <input 
              type="text"
              value={filters.search}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
            />
          </div>
        </div>
      </div>

      {/* Filtered Results */}
      <div className="results">
        <h3>Results ({filteredBooks.length} books)</h3>
        <div className="book-grid">
          {filteredBooks.slice(0, 20).map(book => (
            <div key={book.id} className="book-card">
              <h4>{book.title}</h4>
              <p>by {book.author}</p>
              <p>{book.category} - {book.subject}</p>
              <p>Published: {book.publicationDate}</p>
              <p>Reading Time: {book.readingTime}</p>
              <p>❤️ {book.likes} 🔖 {book.saves}</p>
            </div>
          ))}
        </div>
        {filteredBooks.length > 20 && (
          <p>... and {filteredBooks.length - 20} more books</p>
        )}
      </div>
    </div>
  );
}

export default BookCatalogExample;