# API Design Documentation

## Overview
This document outlines the RESTful API design for the Leafline Library backend. All endpoints follow REST conventions and return JSON responses.

## Base URL
```
Production: https://api.leafline-library.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication
- Uses JWT (JSON Web Tokens) or Auth0
- Include token in Authorization header: `Authorization: Bearer <token>`
- Tokens expire after 24 hours
- Refresh tokens valid for 30 days

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate and receive access token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/logout
Invalidate current session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Books

#### GET /books
Get all books with pagination, filtering, and search.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `category` - Filter by category: "Philosophy", "Programming", "Humanities"
- `search` - Search in title, author, description
- `sortBy` - Sort field: "title", "author", "publicationYear", "likes", "saves"
- `sortOrder` - "asc" or "desc" (default: "asc")

**Example:** `GET /books?category=Programming&search=javascript&page=1&limit=20&sortBy=likes&sortOrder=desc`

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": 105,
        "title": "JavaScript: The Good Parts",
        "author": "Douglas Crockford",
        "category": "Programming",
        "description": "A deep dive into JavaScript's most effective features...",
        "publicationYear": 2008,
        "isbn": "978-0596517748",
        "pageCount": 176,
        "coverImage": "https://cdn.leafline.com/covers/105.jpg",
        "likes": 892,
        "saves": 1267
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalItems": 1000,
      "itemsPerPage": 20
    }
  }
}
```

#### GET /books/:id
Get detailed information about a specific book.

**Response:**
```json
{
  "success": true,
  "data": {
    "book": {
      "id": 105,
      "title": "JavaScript: The Good Parts",
      "author": "Douglas Crockford",
      "category": "Programming",
      "description": "A deep dive into JavaScript's most effective features and how to use them to write better code.",
      "publicationYear": 2008,
      "isbn": "978-0596517748",
      "pageCount": 176,
      "coverImage": "https://cdn.leafline.com/covers/105.jpg",
      "likes": 892,
      "saves": 1267,
      "averageRating": 4.5,
      "totalComments": 23
    }
  }
}
```

#### GET /books/featured
Get featured books for the homepage.

**Query Parameters:**
- `limit` (default: 10) - Number of books to return

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [ ... ]
  }
}
```

#### GET /books/popular
Get most popular books (by likes and saves).

**Query Parameters:**
- `limit` (default: 10)
- `period` - "week", "month", "all" (default: "all")

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [ ... ]
  }
}
```

### User Interactions

#### POST /books/:id/like
Like a book.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 893
  }
}
```

#### DELETE /books/:id/like
Unlike a book.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": false,
    "likeCount": 892
  }
}
```

#### POST /books/:id/save
Save a book to favorites.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "saved": true,
    "saveCount": 1268
  }
}
```

#### DELETE /books/:id/save
Remove book from favorites.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "saved": false,
    "saveCount": 1267
  }
}
```

### Comments

#### GET /books/:id/comments
Get all comments for a book.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `sortBy` - "newest", "oldest", "likes" (default: "newest")

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 1234,
        "bookId": 105,
        "user": {
          "id": 42,
          "username": "codereader",
          "avatar": "https://cdn.leafline.com/avatars/42.jpg"
        },
        "text": "This book changed how I write JavaScript!",
        "likes": 15,
        "isEdited": false,
        "createdAt": "2024-01-10T14:30:00Z",
        "replies": 3
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 23
    }
  }
}
```

#### POST /books/:id/comments
Add a comment to a book.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "text": "This book changed how I write JavaScript!",
  "parentCommentId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": 1234,
      "bookId": 105,
      "text": "This book changed how I write JavaScript!",
      "createdAt": "2024-01-10T14:30:00Z"
    }
  }
}
```

#### PUT /comments/:id
Edit a comment.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "text": "Updated comment text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": 1234,
      "text": "Updated comment text",
      "isEdited": true,
      "updatedAt": "2024-01-10T15:00:00Z"
    }
  }
}
```

#### DELETE /comments/:id
Delete a comment.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

### User Profile

#### GET /users/:id
Get user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "username": "codereader",
      "fullName": "Jane Smith",
      "bio": "Software developer and avid reader",
      "avatar": "https://cdn.leafline.com/avatars/42.jpg",
      "memberSince": "2023-06-15T10:00:00Z",
      "stats": {
        "booksRead": 47,
        "favoriteBooks": 23,
        "commentsPosted": 156
      }
    }
  }
}
```

#### GET /users/me
Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### PUT /users/me
Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "fullName": "Jane Smith",
  "bio": "Updated bio",
  "avatar": "https://cdn.leafline.com/avatars/42.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### GET /users/me/favorites
Get current user's favorite books.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [ ... ],
    "pagination": { ... }
  }
}
```

#### GET /users/me/reading-progress
Get current user's reading progress.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "currentlyReading": [ ... ],
    "wantToRead": [ ... ],
    "completed": [ ... ]
  }
}
```

#### POST /users/me/reading-progress
Update reading progress for a book.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "bookId": 105,
  "status": "currently_reading",
  "progressPercentage": 45
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "bookId": 105,
      "status": "currently_reading",
      "progressPercentage": 45,
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Recommendations

#### GET /recommendations
Get personalized book recommendations.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "book": { ... },
        "score": 0.89,
        "reasons": ["Similar to your favorites", "Popular in Programming"]
      }
    ]
  }
}
```

## Rate Limiting
- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Headers returned**:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Pagination
All list endpoints support pagination:
- Default page size: 20 items
- Maximum page size: 100 items
- Use `page` and `limit` query parameters
- Response includes `pagination` object with metadata

## Filtering and Sorting
- Use query parameters for filtering: `?category=Programming`
- Use `sortBy` and `sortOrder` for sorting
- Combine multiple filters: `?category=Programming&sortBy=likes&sortOrder=desc`

## Security
- All endpoints use HTTPS in production
- Passwords are hashed using bcrypt (cost factor: 12)
- JWT tokens signed with RS256
- SQL injection prevention through parameterized queries
- XSS protection for user-generated content
- CORS configured for allowed origins only
