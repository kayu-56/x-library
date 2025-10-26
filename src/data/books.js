// Generate large dataset for testing performance with ~1000 books
// Each book has: id, title, author, description, publicationDate, subject, category

const categories = ['Fiction', 'Programming', 'Humanities & Social Sciences']
const subjects = {
  'Fiction': ['Magical Realism', 'Contemporary', 'Literary Fiction', 'Science Fiction', 'Fantasy', 'Historical Fiction', 'Mystery', 'Thriller'],
  'Programming': ['UX Design', 'Web Development', 'Data Science', 'Machine Learning', 'Algorithms', 'Software Engineering', 'Mobile Development', 'DevOps'],
  'Humanities & Social Sciences': ['Philosophy', 'History', 'Memoir', 'Sociology', 'Psychology', 'Anthropology', 'Political Science', 'Cultural Studies']
}

const titles = {
  'Fiction': ['Echoes of Tomorrow', 'The Last Garden', 'Silent Rivers', 'Quantum Dreams', 'Midnight Library', 'The Alchemist\'s Son', 'Shadow Cities', 'Crystal Hearts'],
  'Programming': ['Design Patterns', 'Clean Code', 'The Pragmatic Programmer', 'Algorithm Design', 'System Design', 'React Patterns', 'Node.js Guide', 'Python Mastery'],
  'Humanities & Social Sciences': ['The Human Condition', 'Thinking Fast and Slow', 'Sapiens', 'The Republic', 'Being and Time', 'The Social Contract', 'Understanding Power', 'The Art of War']
}

const authors = {
  'Fiction': ['Elena Rivers', 'Jai Patel', 'Mina Kobayashi', 'Alex Chen', 'Sarah Williams', 'Marcus Johnson', 'Isabella Rodriguez', 'David Kim'],
  'Programming': ['Cathy Pearl', 'Martin Fowler', 'Robert Martin', 'Donald Knuth', 'John Resig', 'Brendan Eich', 'Guido van Rossum', 'Linus Torvalds'],
  'Humanities & Social Sciences': ['Hannah Arendt', 'Yuval Noah Harari', 'Daniel Kahneman', 'Plato', 'Jean-Paul Sartre', 'Michel Foucault', 'Noam Chomsky', 'Judith Butler']
}

const descriptions = {
  'Fiction': [
    'A journey through magical landscapes where reality bends to the will of the heart.',
    'An exploration of human connection in a disconnected world.',
    'Stories that bridge the gap between dreams and reality.',
    'A tale of survival and hope in the face of overwhelming odds.'
  ],
  'Programming': [
    'Comprehensive guide to modern software development practices.',
    'Deep dive into algorithms and data structures for efficient coding.',
    'Practical strategies for building scalable and maintainable systems.',
    'Essential patterns and practices for professional developers.'
  ],
  'Humanities & Social Sciences': [
    'An examination of human nature and society through critical analysis.',
    'Insights into the workings of the human mind and behavior.',
    'Historical perspectives that illuminate contemporary issues.',
    'Philosophical inquiry into the meaning of existence and purpose.'
  ]
}

function generateBooks(count = 1000) {
  const books = []
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length]
    const categorySubjects = subjects[category]
    const categoryTitles = titles[category]
    const categoryAuthors = authors[category]
    const categoryDescriptions = descriptions[category]
    
    const subject = categorySubjects[i % categorySubjects.length]
    const titleBase = categoryTitles[i % categoryTitles.length]
    const author = categoryAuthors[i % categoryAuthors.length]
    const description = categoryDescriptions[i % categoryDescriptions.length]
    
    // Generate unique title by adding number if needed
    const titleNumber = Math.floor(i / categoryTitles.length) + 1
    const title = titleNumber > 1 ? `${titleBase} ${titleNumber}` : titleBase
    
    // Generate publication date (last 10 years)
    const year = 2014 + (i % 10)
    const month = String((i % 12) + 1).padStart(2, '0')
    const day = String((i % 28) + 1).padStart(2, '0')
    const publicationDate = `${year}-${month}-${day}`
    
    // Generate random reading time between 3 and 12 hours
    const readingTime = `${(3 + (i % 10))}.${(i % 10) === 0 ? '0' : '5'} hours`
    
    // Generate random likes and saves
    const likes = Math.floor(Math.random() * 100) + 1
    const saves = Math.floor(Math.random() * 50) + 1
    
    books.push({
      id: `book-${i + 1}`,
      title,
      author,
      description,
      publicationDate,
      subject,
      category,
      readingTime,
      likes,
      saves,
    })
  }
  
  return books
}

export const books = generateBooks(1000)

export function getBookById(id) {
  return books.find((b) => b.id === id) || null;
}

export function getRelatedBooks(book, limit = 3) {
  if (!book) return [];
  const sameCategory = books.filter((b) => b.category === book.category && b.id !== book.id);
  return sameCategory.slice(0, limit);
}