#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data for generating realistic book entries
const philosophyTitles = [
  'The Ethics of Artificial Consciousness',
  'Being and Time in the Digital Age',
  'The Phenomenology of Virtual Reality',
  'Existentialism and Modern Technology',
  'The Philosophy of Quantum Computing',
  'Mind, Matter, and Information',
  'The Problem of Free Will in Deterministic Systems',
  'Ethics of Human Enhancement',
  'The Nature of Reality in Simulation Theory',
  'Consciousness and the Brain',
  'Moral Philosophy for the 21st Century',
  'The Logic of Scientific Discovery',
  'Beyond Good and Evil: Modern Interpretations',
  'The Social Contract in Digital Societies',
  'Justice as Fairness: Contemporary Perspectives',
  'The Republic of Algorithms',
  'Nicomachean Ethics for Modern Life',
  'Meditations on Code and Consciousness',
  'The Critique of Pure Reason in AI Era',
  'Thus Spoke Zarathustra: Tech Edition'
];

const philosophyAuthors = [
  'Dr. Sarah Chen',
  'Prof. Michael Roberts',
  'Dr. Elena Volkov',
  'Prof. James Williams',
  'Dr. Aisha Patel',
  'Prof. David Kim',
  'Dr. Maria Santos',
  'Prof. Robert Johnson',
  'Dr. Lisa Anderson',
  'Prof. Thomas Brown'
];

const philosophySubjects = [
  'Ethics',
  'Metaphysics',
  'Epistemology',
  'Philosophy of Mind',
  'Philosophy of Science',
  'Political Philosophy',
  'Existentialism',
  'Phenomenology',
  'Logic',
  'Aesthetics'
];

const programmingTitles = [
  'Advanced React Patterns and Architectures',
  'System Design Interview Guide',
  'The Art of Clean Code',
  'Microservices at Scale',
  'Deep Learning with JavaScript',
  'Blockchain Development Fundamentals',
  'Cloud Native Architecture',
  'Cybersecurity Essentials',
  'Data Structures and Algorithms in Practice',
  'WebAssembly: The Future of Web Development',
  'Kubernetes in Production',
  'Machine Learning Engineering',
  'API Design Best Practices',
  'Database Internals',
  'Network Programming Mastery',
  'Concurrency in Modern Systems',
  'Functional Programming Principles',
  'DevOps Handbook',
  'Site Reliability Engineering',
  'Quantum Computing with Python'
];

const programmingAuthors = [
  'Alex Thompson',
  'Jordan Lee',
  'Sam Rodriguez',
  'Casey Morgan',
  'Taylor Kim',
  'Jamie Chen',
  'Riley Davis',
  'Morgan Johnson',
  'Quinn Wilson',
  'Avery Brown'
];

const programmingSubjects = [
  'Software Engineering',
  'Web Development',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'Data Science',
  'Mobile Development',
  'Game Development',
  'Database Systems'
];

const humanitiesTitles = [
  'The Digital Renaissance: Art in the Age of AI',
  'Social Media and Modern Democracy',
  'Climate Change and Human Migration',
  'The Psychology of Online Communities',
  'Globalization in the 21st Century',
  'Cultural Identity in a Connected World',
  'The History of Information Technology',
  'Education in the Digital Age',
  'Mental Health and Modern Life',
  'Economic Inequality and Technology',
  'The Future of Work',
  'Gender and Technology',
  'Race in Digital Spaces',
  'Environmental Philosophy',
  'Urban Planning for Smart Cities',
  'The Anthropocene and Human Responsibility',
  'Media Literacy in the Information Age',
  'Cognitive Science and Decision Making',
  'Linguistics and Natural Language Processing',
  'The Sociology of Social Networks'
];

const humanitiesAuthors = [
  'Dr. Rachel Green',
  'Prof. Marcus White',
  'Dr. Sophia Martinez',
  'Prof. Ahmed Hassan',
  'Dr. Emma Thompson',
  'Prof. Carlos Rodriguez',
  'Dr. Yuki Tanaka',
  'Prof. Fatima Al-Rashid',
  'Dr. Ivan Petrov',
  'Prof. Nneka Okonkwo'
];

const humanitiesSubjects = [
  'Sociology',
  'Psychology',
  'Anthropology',
  'History',
  'Political Science',
  'Economics',
  'Cultural Studies',
  'Media Studies',
  'Environmental Studies',
  'Gender Studies'
];

const descriptionTemplates = [
  'A comprehensive exploration of {subject} that challenges conventional wisdom and offers fresh perspectives on contemporary issues.',
  'This groundbreaking work examines the intersection of {subject} and modern technology, providing insights that are both practical and profound.',
  'An essential read for anyone interested in understanding the complexities of {subject} in today\'s rapidly changing world.',
  'Through meticulous research and compelling analysis, this book illuminates the fundamental principles of {subject}.',
  'A thought-provoking journey through the landscape of {subject}, blending theoretical depth with practical applications.',
  'This seminal work bridges the gap between academic theory and real-world practice in the field of {subject}.',
  'An authoritative guide that synthesizes cutting-edge research in {subject} with accessible explanations for broader audiences.',
  'Through case studies and expert analysis, this book reveals the hidden patterns and underlying principles of {subject}.',
  'A masterful treatment of {subject} that will reshape how you think about the world around you.',
  'This essential text combines rigorous scholarship with engaging storytelling to make {subject} accessible to all readers.'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDescription(subject) {
  const template = getRandomElement(descriptionTemplates);
  return template.replace('{subject}', subject);
}

function generatePublicationDate() {
  const startYear = 2015;
  const endYear = 2024;
  const year = getRandomInt(startYear, endYear);
  const month = String(getRandomInt(1, 12)).padStart(2, '0');
  const day = String(getRandomInt(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateReadingTime() {
  const hours = getRandomInt(3, 12);
  const minutes = getRandomInt(0, 59);
  return minutes > 30 ? `${hours + 1} hours` : `${hours}.${Math.floor(minutes / 6)} hours`;
}

function generateBookId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function generateBooks(category, titles, authors, subjects, count) {
  const books = [];
  const usedCombinations = new Set();
  
  for (let i = 0; i < count; i++) {
    let title, author, subject, combination;
    
    do {
      title = getRandomElement(titles);
      author = getRandomElement(authors);
      subject = getRandomElement(subjects);
      combination = `${title}-${author}-${subject}`;
    } while (usedCombinations.has(combination));
    
    usedCombinations.add(combination);
    
    const book = {
      id: generateBookId(title),
      title,
      author,
      description: generateDescription(subject),
      publicationDate: generatePublicationDate(),
      subject,
      category,
      readingTime: generateReadingTime(),
      likes: getRandomInt(5, 100),
      saves: getRandomInt(2, 50)
    };
    
    books.push(book);
  }
  
  return books;
}

function main() {
  const booksPerCategory = Math.floor(1000 / 3);
  const remainder = 1000 % 3;
  
  console.log('Generating mock book dataset...');
  
  const philosophyBooks = generateBooks(
    'Philosophy',
    philosophyTitles,
    philosophyAuthors,
    philosophySubjects,
    booksPerCategory + remainder
  );
  
  const programmingBooks = generateBooks(
    'Programming',
    programmingTitles,
    programmingAuthors,
    programmingSubjects,
    booksPerCategory
  );
  
  const humanitiesBooks = generateBooks(
    'Humanities & Social Sciences',
    humanitiesTitles,
    humanitiesAuthors,
    humanitiesSubjects,
    booksPerCategory
  );
  
  const allBooks = [...philosophyBooks, ...programmingBooks, ...humanitiesBooks];
  
  // Shuffle the array to randomize the order
  for (let i = allBooks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allBooks[i], allBooks[j]] = [allBooks[j], allBooks[i]];
  }
  
  // Ensure output directory exists
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'books.json');
  fs.writeFileSync(outputPath, JSON.stringify(allBooks, null, 2));
  
  console.log(`Generated ${allBooks.length} books and saved to ${outputPath}`);
  console.log(`- Philosophy: ${philosophyBooks.length} books`);
  console.log(`- Programming: ${programmingBooks.length} books`);
  console.log(`- Humanities & Social Sciences: ${humanitiesBooks.length} books`);
}

main();