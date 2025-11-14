import { useMemo } from 'react'
import { diffLines } from 'diff'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './CodeDiffViewer.module.scss'

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('go', go)

const languageAlias = {
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  python: 'python',
  py: 'python',
  go: 'go',
}

const normaliseLines = (value) => {
  if (!value) return []
  const lines = value.split('\n')
  if (lines[lines.length - 1] === '') {
    lines.pop()
  }
  return lines
}

const highlightLine = (line, language) => (
  <SyntaxHighlighter
    language={languageAlias[language] ?? 'typescript'}
    style={duotoneSpace}
    PreTag="span"
    customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
    codeTagProps={{ style: { padding: 0 } }}
  >
    {line || ' '}
  </SyntaxHighlighter>
)

function CodeDiffViewer({ oldCode = '', newCode = '', language = 'typescript' }) {
  const rows = useMemo(() => {
    const parts = diffLines(oldCode, newCode, { newlineIsToken: true })
    let oldLineNumber = 1
    let newLineNumber = 1

    return parts.flatMap((part) => {
      const lines = normaliseLines(part.value)
      if (!lines.length) return []

      return lines.map((line) => {
        if (part.added) {
          return {
            id: `${newLineNumber}-added`,
            type: 'added',
            oldLine: '',
            newLine: newLineNumber++,
            content: line,
          }
        }

        if (part.removed) {
          return {
            id: `${oldLineNumber}-removed`,
            type: 'removed',
            oldLine: oldLineNumber++,
            newLine: '',
            content: line,
          }
        }

        return {
          id: `${oldLineNumber}-context`,
          type: 'context',
          oldLine: oldLineNumber++,
          newLine: newLineNumber++,
          content: line,
        }
      })
    })
  }, [oldCode, newCode])

  return (
    <div className={styles.viewer}>
      <div className={styles.headerRow}>
        <span>Base</span>
        <span>Proposed</span>
      </div>
      <div className={styles.body}>
        {rows.map((row) => (
          <div key={row.id} className={styles.row} data-type={row.type}>
            <span className={styles.lineNumber}>{row.oldLine}</span>
            <span className={styles.lineNumber}>{row.newLine}</span>
            <span className={styles.code}>{highlightLine(row.content, language)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CodeDiffViewer
