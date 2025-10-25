import { useContext } from 'react';
import { BookContext } from '../contexts/BookContextBase.jsx';

// Custom hook for using the book context
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}