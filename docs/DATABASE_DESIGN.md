# Database Design

## Overview
The Leafline Library uses a hybrid database approach:
- **PostgreSQL** for structured, relational data (books, users, relationships)
- **MongoDB** for flexible, document-based data (comments, notifications, activity logs)

## PostgreSQL Schema

### Entity Relationship Diagram

```
users ──────┐
            │
            ├──< favorite_books >── books
            │
            ├──< book_likes >────── books
            │
            ├──< reading_progress >─ books
            │
            └──< user_sessions
```

### Tables

#### users
Stores user account information.

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

#### books
Stores the library's book collection (1,000 books).

```sql
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Philosophy', 'Programming', 'Humanities')),
    description TEXT,
    publication_year INTEGER,
    isbn VARCHAR(20) UNIQUE,
    page_count INTEGER,
    cover_image_url TEXT,
    like_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_publication_year ON books(publication_year);
CREATE INDEX idx_books_likes ON books(like_count DESC);
CREATE INDEX idx_books_saves ON books(save_count DESC);

-- Full-text search index
CREATE INDEX idx_books_fulltext ON books 
USING GIN(to_tsvector('english', title || ' ' || author || ' ' || COALESCE(description, '')));
```

#### favorite_books
Junction table for user favorites.

```sql
CREATE TABLE favorite_books (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_favorite_books_user ON favorite_books(user_id);
CREATE INDEX idx_favorite_books_book ON favorite_books(book_id);
```

#### book_likes
Tracks which users have liked which books.

```sql
CREATE TABLE book_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_book_likes_user ON book_likes(user_id);
CREATE INDEX idx_book_likes_book ON book_likes(book_id);
```

#### reading_progress
Tracks user's reading status and progress for books.

```sql
CREATE TABLE reading_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('want_to_read', 'currently_reading', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_status ON reading_progress(status);
```

#### user_sessions
Manages user authentication sessions.

```sql
CREATE TABLE user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
```

### Database Triggers

#### Automatically update like_count when book is liked/unliked
```sql
CREATE OR REPLACE FUNCTION update_book_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE books SET like_count = like_count + 1 
        WHERE book_id = NEW.book_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE books SET like_count = like_count - 1 
        WHERE book_id = OLD.book_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_book_like_count
AFTER INSERT OR DELETE ON book_likes
FOR EACH ROW EXECUTE FUNCTION update_book_like_count();
```

#### Automatically update save_count when book is saved/unsaved
```sql
CREATE OR REPLACE FUNCTION update_book_save_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE books SET save_count = save_count + 1 
        WHERE book_id = NEW.book_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE books SET save_count = save_count - 1 
        WHERE book_id = OLD.book_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_book_save_count
AFTER INSERT OR DELETE ON favorite_books
FOR EACH ROW EXECUTE FUNCTION update_book_save_count();
```

#### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## MongoDB Schema

### Collections

#### comments
Stores user comments and discussions about books.

```javascript
{
  _id: ObjectId,
  commentId: Number, // auto-increment
  bookId: Number, // references books.book_id in PostgreSQL
  userId: Number, // references users.user_id in PostgreSQL
  username: String,
  userAvatar: String,
  commentText: String,
  parentCommentId: Number, // for nested replies, null for top-level
  likes: Number,
  likedBy: [Number], // array of user IDs
  isEdited: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.comments.createIndex({ bookId: 1, createdAt: -1 });
db.comments.createIndex({ userId: 1 });
db.comments.createIndex({ parentCommentId: 1 });
```

#### notifications
User notifications for interactions and updates.

```javascript
{
  _id: ObjectId,
  notificationId: Number,
  userId: Number, // recipient user ID
  type: String, // 'comment', 'reply', 'like', 'new_book'
  relatedBookId: Number,
  relatedCommentId: Number,
  relatedUserId: Number, // user who triggered the notification
  message: String,
  isRead: Boolean,
  createdAt: Date
}

// Indexes
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.notifications.createIndex({ type: 1 });
```

#### user_activity
Tracks user activity for analytics and recommendations.

```javascript
{
  _id: ObjectId,
  activityId: Number,
  userId: Number,
  activityType: String, // 'view', 'search', 'like', 'save', 'comment'
  bookId: Number,
  searchQuery: String,
  metadata: {
    // flexible field for additional data
    duration: Number,
    referrer: String,
    category: String
  },
  timestamp: Date
}

// Indexes
db.user_activity.createIndex({ userId: 1, timestamp: -1 });
db.user_activity.createIndex({ activityType: 1 });
db.user_activity.createIndex({ bookId: 1 });
```

#### recommendations
Cached personalized recommendations for users.

```javascript
{
  _id: ObjectId,
  userId: Number,
  recommendedBooks: [
    {
      bookId: Number,
      score: Number,
      reasons: [String] // e.g., ['similar_to_favorites', 'trending']
    }
  ],
  generatedAt: Date,
  expiresAt: Date
}

// Indexes
db.recommendations.createIndex({ userId: 1 });
db.recommendations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

## Seed Data

### Books Distribution (1,000 total)

**Philosophy (333 books)**:
- Ancient Philosophy: 60 books (Plato, Aristotle, Stoics, etc.)
- Medieval Philosophy: 40 books (Augustine, Aquinas, etc.)
- Early Modern: 50 books (Descartes, Spinoza, Leibniz, Locke, Hume, Kant)
- 19th Century: 60 books (Hegel, Kierkegaard, Nietzsche, Mill, Marx)
- 20th Century: 80 books (Husserl, Heidegger, Sartre, Camus, Wittgenstein, Rawls)
- Contemporary: 43 books (Butler, Žižek, Nussbaum, Singer, etc.)

**Programming (334 books)**:
- Programming Languages: 90 books (JavaScript, Python, Java, C++, Rust, Go, etc.)
- Software Engineering: 80 books (Design patterns, architecture, clean code)
- Algorithms & Data Structures: 60 books
- Web Development: 50 books (Frontend, backend, full-stack)
- Mobile Development: 30 books (iOS, Android, React Native)
- DevOps & Cloud: 24 books (Docker, Kubernetes, AWS, Azure)

**Humanities & Social Sciences (333 books)**:
- History: 90 books (World history, civilization studies)
- Psychology: 80 books (Cognitive, behavioral, clinical)
- Sociology: 70 books (Social theory, research methods)
- Anthropology: 50 books (Cultural, physical, linguistic)
- Political Science: 30 books (Political theory, international relations)
- Economics: 13 books (Microeconomics, macroeconomics, behavioral)

### Sample Seed Script (PostgreSQL)

```sql
-- Insert sample books
INSERT INTO books (title, author, category, description, publication_year, isbn, page_count, cover_image_url)
VALUES
('Being and Time', 'Martin Heidegger', 'Philosophy', 'Groundbreaking work exploring the concept of being...', 1927, '978-0061575594', 589, 'https://example.com/covers/being-and-time.jpg'),
('Clean Code', 'Robert C. Martin', 'Programming', 'A handbook of agile software craftsmanship...', 2008, '978-0132350884', 464, 'https://example.com/covers/clean-code.jpg'),
('Sapiens', 'Yuval Noah Harari', 'Humanities', 'A brief history of humankind...', 2011, '978-0062316097', 464, 'https://example.com/covers/sapiens.jpg');
-- ... (997 more INSERT statements)

-- Insert sample user
INSERT INTO users (username, email, password_hash, full_name, bio)
VALUES
('johndoe', 'john@example.com', '$2b$12$...', 'John Doe', 'Philosophy enthusiast and programmer');
```

## Data Relationships

### Many-to-Many
- Users ↔ Books (favorites via `favorite_books`)
- Users ↔ Books (likes via `book_likes`)

### One-to-Many
- Users → Sessions
- Users → Comments (MongoDB)
- Books → Comments (MongoDB)
- Users → Reading Progress

## Indexing Strategy

### PostgreSQL
- **Primary keys**: Automatically indexed
- **Foreign keys**: Indexed for join performance
- **Search fields**: Full-text search index on books
- **Sort fields**: Indexes on `like_count`, `save_count`, `publication_year`
- **Filter fields**: Indexes on `category`, `status`

### MongoDB
- **Query patterns**: Index on frequently queried fields
- **Compound indexes**: For complex queries (e.g., `userId + isRead + createdAt`)
- **TTL indexes**: Auto-expire old notifications and activity logs

## Data Integrity

### Constraints
- **NOT NULL**: Required fields
- **UNIQUE**: Username, email, ISBN
- **CHECK**: Category enum, progress percentage range
- **FOREIGN KEY CASCADE**: Automatic cleanup on user/book deletion

### Validation
- Email format validation
- Password strength requirements (8+ chars, mixed case, numbers, symbols)
- ISBN format validation (ISBN-10 or ISBN-13)
- Publication year range (e.g., -500 to current year)

## Backup Strategy

### PostgreSQL
- **Daily full backups**: Using `pg_dump`
- **Continuous archiving**: Write-Ahead Log (WAL) archiving
- **Point-in-time recovery**: Enabled
- **Retention**: 30 days

### MongoDB
- **Daily snapshots**: Using `mongodump`
- **Replica sets**: 3-node replica set for high availability
- **Oplog**: For incremental backups
- **Retention**: 30 days

## Performance Optimization

### Query Optimization
- Use prepared statements to prevent SQL injection and improve performance
- Implement connection pooling (10-20 connections)
- Use `EXPLAIN ANALYZE` to optimize slow queries
- Add indexes based on query patterns
- Implement caching layer (Redis) for frequently accessed data

### Data Archiving
- Archive old sessions (> 30 days) to separate table
- Archive deleted comments to separate collection
- Implement soft deletes where appropriate

## Security

### Encryption
- **At rest**: Database-level encryption
- **In transit**: SSL/TLS for all connections
- **Password hashing**: bcrypt with cost factor 12

### Access Control
- **Principle of least privilege**: Separate read/write users
- **Application user**: Limited permissions (no DROP, CREATE)
- **Admin user**: Full permissions, used only for migrations
- **Audit logs**: Track all data modifications
