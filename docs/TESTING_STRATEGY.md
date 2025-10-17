# Testing Strategy

## Overview
Comprehensive testing strategy for the Leafline Library platform, covering unit tests, integration tests, end-to-end tests, and user acceptance testing.

## Testing Pyramid

```
        /\
       /  \    E2E Tests (5%)
      /____\
     /      \  Integration Tests (15%)
    /________\
   /          \ Unit Tests (80%)
  /__________/
```

## Unit Testing

### Frontend Unit Tests (Vitest + React Testing Library)

#### Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

#### Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
})
```

#### Example Component Test
```javascript
// src/components/book/BookCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BookCard from './BookCard'

describe('BookCard', () => {
  const mockBook = {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    likes: 100,
    saves: 50,
    coverImage: 'https://example.com/cover.jpg'
  }

  it('renders book information correctly', () => {
    render(<BookCard book={mockBook} />)
    
    expect(screen.getByText('Clean Code')).toBeInTheDocument()
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('calls onLike when like button is clicked', () => {
    const handleLike = vi.fn()
    render(<BookCard book={mockBook} onLike={handleLike} />)
    
    const likeButton = screen.getByRole('button', { name: /like/i })
    fireEvent.click(likeButton)
    
    expect(handleLike).toHaveBeenCalledWith(mockBook.id)
  })

  it('displays correct category badge color', () => {
    render(<BookCard book={mockBook} />)
    
    const badge = screen.getByText('Programming')
    expect(badge).toHaveClass('badge--programming')
  })
})
```

### Backend Unit Tests (Jest + Supertest)

#### Setup
```bash
npm install -D jest supertest @types/jest
```

#### Configuration (`jest.config.js`)
```javascript
export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/data/**',
    '!server/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

#### Example Controller Test
```javascript
// server/__tests__/controllers/bookController.test.js
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { getBooks, getBookById } from '../../controllers/bookController.js'

describe('Book Controller', () => {
  let mockReq, mockRes, mockNext

  beforeEach(() => {
    mockReq = { query: {}, params: {} }
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
    mockNext = jest.fn()
  })

  describe('getBooks', () => {
    it('should return paginated books', async () => {
      mockReq.query = { page: 1, limit: 20 }

      await getBooks(mockReq, mockRes, mockNext)

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            books: expect.any(Array),
            pagination: expect.any(Object)
          })
        })
      )
    })

    it('should filter books by category', async () => {
      mockReq.query = { category: 'Programming' }

      await getBooks(mockReq, mockRes, mockNext)

      const response = mockRes.json.mock.calls[0][0]
      const books = response.data.books

      books.forEach(book => {
        expect(book.category).toBe('Programming')
      })
    })
  })

  describe('getBookById', () => {
    it('should return 404 for non-existent book', async () => {
      mockReq.params = { id: 99999 }

      await getBookById(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(Object)
        })
      )
    })
  })
})
```

## Integration Testing

### Database Integration Tests

```javascript
// server/__tests__/integration/database.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { pool } from '../../config/database.js'
import { createUser, getUserById } from '../../models/userModel.js'

describe('Database Integration', () => {
  beforeAll(async () => {
    // Set up test database
    await pool.query('BEGIN')
  })

  afterAll(async () => {
    // Rollback test transactions
    await pool.query('ROLLBACK')
    await pool.end()
  })

  it('should create and retrieve a user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123!'
    }

    const createdUser = await createUser(userData)
    expect(createdUser).toHaveProperty('id')

    const retrievedUser = await getUserById(createdUser.id)
    expect(retrievedUser.username).toBe(userData.username)
    expect(retrievedUser.email).toBe(userData.email)
  })
})
```

### API Integration Tests

```javascript
// server/__tests__/integration/api.test.js
import request from 'supertest'
import { describe, it, expect, beforeAll } from '@jest/globals'
import app from '../../server.js'

describe('API Integration Tests', () => {
  let authToken
  let userId

  beforeAll(async () => {
    // Register test user and get auth token
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
    
    authToken = response.body.data.token
    userId = response.body.data.user.id
  })

  describe('GET /api/v1/books', () => {
    it('should return books with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/books?page=1&limit=20')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.books).toBeInstanceOf(Array)
      expect(response.body.data.pagination).toHaveProperty('totalPages')
    })
  })

  describe('POST /api/v1/books/:id/like', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/api/v1/books/1/like')
        .expect(401)
    })

    it('should like a book when authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/books/1/like')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.liked).toBe(true)
    })
  })
})
```

## End-to-End Testing

### Setup (Playwright)

```bash
npm install -D @playwright/test
npx playwright install
```

#### Configuration (`playwright.config.js`)
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  }
})
```

#### Example E2E Test
```javascript
// e2e/browse-books.spec.js
import { test, expect } from '@playwright/test'

test.describe('Browse Books', () => {
  test('should display book grid', async ({ page }) => {
    await page.goto('/browse')
    
    await expect(page.getByRole('heading', { name: 'Browse the stacks' })).toBeVisible()
    
    const bookCards = page.locator('.book-card')
    await expect(bookCards).toHaveCount(20) // Default page size
  })

  test('should filter books by category', async ({ page }) => {
    await page.goto('/browse')
    
    await page.click('text=Programming')
    
    const bookCards = page.locator('.book-card')
    const firstCard = bookCards.first()
    await expect(firstCard.locator('.badge')).toHaveText('Programming')
  })

  test('should search for books', async ({ page }) => {
    await page.goto('/browse')
    
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('JavaScript')
    await searchInput.press('Enter')
    
    await page.waitForURL(/search=JavaScript/)
    
    const bookCards = page.locator('.book-card')
    await expect(bookCards.first()).toContainText('JavaScript')
  })

  test('should navigate to book detail page', async ({ page }) => {
    await page.goto('/browse')
    
    const firstBook = page.locator('.book-card').first()
    const bookTitle = await firstBook.locator('h3').textContent()
    
    await firstBook.click()
    
    await expect(page.getByRole('heading', { name: bookTitle })).toBeVisible()
  })
})

test.describe('User Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Login')
    await page.click('text=Register')
    
    await page.fill('[name="username"]', 'testuser')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/profile')
    await expect(page.getByText('testuser')).toBeVisible()
  })

  test('should login existing user', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Login')
    
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/profile')
  })
})

test.describe('Book Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')
  })

  test('should like a book', async ({ page }) => {
    await page.goto('/books/1')
    
    const likeButton = page.locator('button:has-text("Like")')
    const initialCount = await page.locator('.like-count').textContent()
    
    await likeButton.click()
    
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true')
    const newCount = await page.locator('.like-count').textContent()
    expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1)
  })

  test('should save book to favorites', async ({ page }) => {
    await page.goto('/books/1')
    
    await page.click('button:has-text("Save")')
    
    await expect(page.locator('text=Added to favorites')).toBeVisible()
    
    await page.goto('/profile')
    await expect(page.locator('.favorite-books .book-card').first()).toBeVisible()
  })

  test('should post a comment', async ({ page }) => {
    await page.goto('/books/1')
    
    const commentText = 'This is a great book!'
    await page.fill('[name="comment"]', commentText)
    await page.click('button:has-text("Post Comment")')
    
    await expect(page.locator(`text=${commentText}`)).toBeVisible()
  })
})
```

## Performance Testing

### Lighthouse CI

#### Configuration (`.lighthouserc.json`)
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:5173",
        "http://localhost:5173/browse",
        "http://localhost:5173/books/1"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Load Testing (k6)

```javascript
// load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '2m', target: 50 },  // Stay at 50 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be below 1%
  },
}

export default function () {
  // Test homepage
  let response = http.get('https://leafline-library.com')
  check(response, {
    'homepage status 200': (r) => r.status === 200,
    'homepage load time < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)

  // Test browse page
  response = http.get('https://leafline-library.com/browse')
  check(response, {
    'browse page status 200': (r) => r.status === 200,
  })
  sleep(1)

  // Test API endpoint
  response = http.get('https://api.leafline-library.com/api/v1/books')
  check(response, {
    'API status 200': (r) => r.status === 200,
    'API response time < 300ms': (r) => r.timings.duration < 300,
  })
  sleep(1)
}
```

## Accessibility Testing

### Automated Testing (axe-core)

```javascript
// e2e/accessibility.spec.js
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('browse page should be accessible', async ({ page }) => {
    await page.goto('/browse')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

## User Acceptance Testing (UAT)

### UAT Test Cases

#### Test Case 1: User Registration
- **Objective**: Verify new users can register successfully
- **Steps**:
  1. Navigate to registration page
  2. Fill in username, email, password
  3. Submit form
- **Expected**: User is registered and redirected to profile page
- **Status**: [ ] Pass [ ] Fail

#### Test Case 2: Browse and Filter Books
- **Objective**: Users can browse and filter books by category
- **Steps**:
  1. Navigate to browse page
  2. Select "Programming" filter
  3. Verify only programming books are displayed
- **Expected**: Only programming books visible
- **Status**: [ ] Pass [ ] Fail

#### Test Case 3: Search Functionality
- **Objective**: Search returns relevant results
- **Steps**:
  1. Enter "JavaScript" in search bar
  2. Submit search
  3. Review results
- **Expected**: Results contain "JavaScript" in title, author, or description
- **Status**: [ ] Pass [ ] Fail

## Test Coverage Goals

### Coverage Targets
- **Unit Tests**: 80% coverage minimum
- **Integration Tests**: 70% coverage minimum
- **E2E Tests**: Critical user paths covered
- **Overall**: 75% code coverage minimum

### Running Coverage Reports
```bash
# Frontend coverage
npm run test:coverage

# Backend coverage
npm run test:coverage

# View HTML report
open coverage/index.html
```

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Data Management

### Test Database
- Separate test database from development
- Seed with consistent test data
- Reset between test runs

### Test User Accounts
```javascript
const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!'
  },
  regular: {
    email: 'user@test.com',
    password: 'UserPass123!'
  }
}
```

## Quality Gates

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test:unit",
      "pre-push": "npm run test"
    }
  }
}
```

### Pull Request Requirements
- [ ] All tests passing
- [ ] Code coverage ≥ 75%
- [ ] No linting errors
- [ ] No accessibility violations
- [ ] Performance benchmarks met
- [ ] Code review approved

## Bug Tracking

### Bug Report Template
```markdown
**Description**: Brief description of the bug

**Steps to Reproduce**:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: If applicable

**Environment**:
- Browser: [e.g. Chrome 120]
- OS: [e.g. macOS 14]
- Device: [e.g. Desktop, iPhone 12]

**Additional Context**: Any other context
```
