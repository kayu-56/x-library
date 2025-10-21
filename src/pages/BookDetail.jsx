import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBookById, getRelatedBooks } from '../data/books.js'
import BookCard from '../components/BookCard.jsx'
import styles from './BookDetail.module.scss'
import {
  addComment,
  deleteComment,
  ensureCounts,
  getComments,
  getCounts,
  getCurrentUser,
  getUserActionsForBook,
  toggleLike,
  toggleSave,
  updateComment,
} from '../utils/storage.js'

function formatDate(ts) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function BookDetailPage() {
  const { bookId } = useParams()
  const book = useMemo(() => getBookById(bookId), [bookId])
  const user = useMemo(() => getCurrentUser(), [])

  const [counts, setCounts] = useState({ likes: 0, saves: 0 })
  const [userState, setUserState] = useState({ liked: false, saved: false })
  const [comments, setComments] = useState([])

  const [commentText, setCommentText] = useState('')
  const [formError, setFormError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    if (book) {
      document.title = `${book.title} – Leafline Library`
    } else {
      document.title = 'Book Not Found – Leafline Library'
    }
  }, [book])

  useEffect(() => {
    if (!book) return
    // Initialize counts from storage with dataset defaults
    ensureCounts(book.id, { likes: book.likes || 0, saves: book.saves || 0 })
    setCounts(getCounts(book.id))
    setUserState(getUserActionsForBook(book.id))
    setComments(getComments(book.id))
  }, [book])

  if (!book) {
    return (
      <section className={styles.wrapper}>
        <h1>Book not found</h1>
        <p className={styles.summary}>
          The requested book could not be located. It may have been removed or the
          ID is incorrect.
        </p>
        <Link to="/browse" className={styles.backLink}>
          ← Back to Browse
        </Link>
      </section>
    )
  }

  const related = getRelatedBooks(book, 3)

  function handleToggleLike() {
    const { liked, counts: nextCounts } = toggleLike(book.id)
    setUserState((s) => ({ ...s, liked }))
    setCounts(nextCounts)
  }

  function handleToggleSave() {
    const { saved, counts: nextCounts } = toggleSave(book.id)
    setUserState((s) => ({ ...s, saved }))
    setCounts(nextCounts)
  }

  function validate(content) {
    const trimmed = content.trim()
    if (!trimmed) return 'Comment cannot be empty.'
    if (trimmed.length < 2) return 'Please enter at least 2 characters.'
    if (trimmed.length > 1000) return 'Comment is too long (max 1000 characters).'
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate(commentText)
    if (err) {
      setFormError(err)
      return
    }
    addComment(book.id, commentText)
    setComments(getComments(book.id))
    setCommentText('')
    setFormError('')
  }

  function onStartEdit(id, current) {
    setEditingId(id)
    setEditingText(current)
  }

  function onCancelEdit() {
    setEditingId(null)
    setEditingText('')
  }

  function onSaveEdit(id) {
    const err = validate(editingText)
    if (err) return setFormError(err)
    updateComment(book.id, id, editingText)
    setComments(getComments(book.id))
    setEditingId(null)
    setEditingText('')
    setFormError('')
  }

  function onDelete(id) {
    deleteComment(book.id, id)
    setComments(getComments(book.id))
  }

  return (
    <section className={styles.wrapper}>
      <h1>{book.title}</h1>
      <p className={styles.meta}>By {book.author}</p>
      <p className={styles.summary}>{book.description}</p>

      <dl className={styles.dataList}>
        <div>
          <dt>Publication date</dt>
          <dd>{new Date(book.publicationDate).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt>Subject</dt>
          <dd>{book.subject}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{book.category}</dd>
        </div>
        <div>
          <dt>Estimated reading time</dt>
          <dd>{book.readingTime}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.actionBtn} ${userState.liked ? styles.actionActive : ''}`}
          onClick={handleToggleLike}
          aria-pressed={userState.liked}
        >
          <span>👍 Like</span>
          <span className={styles.count}>{counts.likes}</span>
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${userState.saved ? styles.actionActive : ''}`}
          onClick={handleToggleSave}
          aria-pressed={userState.saved}
        >
          <span>🔖 Save</span>
          <span className={styles.count}>{counts.saves}</span>
        </button>
      </div>

      <section className={styles.comments} aria-labelledby="comments-heading">
        <h2 id="comments-heading">Comments</h2>
        <form className={styles.commentForm} onSubmit={handleSubmit} noValidate>
          <label htmlFor="comment" className="sr-only">
            Add a comment
          </label>
          <textarea
            id="comment"
            className={styles.textarea}
            placeholder={`Share your thoughts on ${book.title}...`}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className={styles.formRow}>
            <span className={styles.error} role="alert">
              {formError}
            </span>
            <button type="submit" className={styles.submitBtn}>
              Post comment as {user.name}
            </button>
          </div>
        </form>

        <ul className={styles.commentList}>
          {comments.length === 0 && (
            <li className={styles.commentItem}>
              <p className={styles.commentTime}>
                No comments yet. Be the first to share your perspective.
              </p>
            </li>
          )}
          {comments.map((c) => {
            const isAuthor = c.authorId === user.id
            return (
              <li key={c.id} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{c.authorName}</span>
                  <span className={styles.commentTime}>
                    {formatDate(c.updatedAt || c.createdAt)}{c.updatedAt ? ' (edited)' : ''}
                  </span>
                </div>
                {editingId === c.id ? (
                  <div>
                    <textarea
                      className={styles.textarea}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className={styles.commentActions}>
                      <button type="button" className={styles.smallBtn} onClick={() => onSaveEdit(c.id)}>
                        Save
                      </button>
                      <button type="button" className={styles.smallBtn} onClick={onCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{c.content}</p>
                    {isAuthor && (
                      <div className={styles.commentActions}>
                        <button
                          type="button"
                          className={styles.smallBtn}
                          onClick={() => onStartEdit(c.id, c.content)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.smallBtn}
                          onClick={() => onDelete(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading">Related books</h2>
          <div className={styles.relatedGrid}>
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}

      <Link to="/browse" className={styles.backLink}>
        ← Back to Browse
      </Link>
    </section>
  )
}

export default BookDetailPage
