import { books } from '../data/books.js'

const categories = ['Fiction', 'Programming', 'Humanities & Social Sciences']

export function getFeaturedBooks(category, limit = 6) {
  const categoryBooks = books.filter(book => book.category === category)
  
  // Sort by likes and saves to get popular books, then take the top ones
  const sortedBooks = categoryBooks.sort((a, b) => {
    const scoreA = (a.likes || 0) + (a.saves || 0)
    const scoreB = (b.likes || 0) + (b.saves || 0)
    return scoreB - scoreA
  })
  
  return sortedBooks.slice(0, limit)
}

export function getAllFeaturedBooks(limitPerCategory = 4) {
  const featured = {}
  
  categories.forEach(category => {
    featured[category] = getFeaturedBooks(category, limitPerCategory)
  })
  
  return featured
}

export function getRandomFeaturedBooks(category, limit = 6) {
  const categoryBooks = books.filter(book => book.category === category)
  const shuffled = [...categoryBooks].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, limit)
}