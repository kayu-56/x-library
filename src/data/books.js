// Simple in-memory catalog used by the SPA
// Each book has: id, title, author, description, publicationDate, subject, category

export const books = [
  {
    id: 'atlas-of-echoes',
    title: 'Atlas of Echoes',
    author: 'Elena Rivers',
    description:
      'A cartographer charts the emotional geography of a living city and uncovers the memories woven into its streets.',
    publicationDate: '2021-05-12',
    subject: 'Magical Realism',
    category: 'Fiction',
    readingTime: '7 hours',
    likes: 24,
    saves: 12,
  },
  {
    id: 'luminary-threads',
    title: 'Luminary Threads',
    author: 'Jai Patel',
    description:
      'Siblings inherit a tailor shop that stitches light itself, blending magical realism with heartfelt drama.',
    publicationDate: '2020-11-02',
    subject: 'Contemporary',
    category: 'Fiction',
    readingTime: '5.5 hours',
    likes: 12,
    saves: 5,
  },
  {
    id: 'designing-voice-interfaces',
    title: 'Designing Voice Interfaces',
    author: 'Cathy Pearl',
    description:
      'Practical strategies for crafting natural, conversational voice-first experiences across platforms and devices.',
    publicationDate: '2017-01-25',
    subject: 'UX Design',
    category: 'Programming',
    readingTime: '6 hours',
    likes: 8,
    saves: 22,
  },
  {
    id: 'threads-of-light',
    title: 'Threads of Light',
    author: 'Mina Kobayashi',
    description:
      'A textile artist maps her family history through fabrics, weaving memory and identity across generations.',
    publicationDate: '2019-08-19',
    subject: 'Memoir',
    category: 'Humanities & Social Sciences',
    readingTime: '4.5 hours',
    likes: 16,
    saves: 10,
  },
]

export function getBookById(id) {
  return books.find((b) => b.id === id) || null;
}

export function getRelatedBooks(book, limit = 3) {
  if (!book) return [];
  const sameCategory = books.filter((b) => b.category === book.category && b.id !== book.id);
  return sameCategory.slice(0, limit);
}
