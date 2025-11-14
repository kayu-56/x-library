import { useState, useEffect } from 'react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { useCodeCollab } from '../hooks/useCodeCollab'
import { Code, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react'
import './CodeDiffViewer.module.scss'

const CodeDiffViewerPage = () => {
  const { analyzeDiff } = useCodeCollab()
  const [oldCode, setOldCode] = useState('')
  const [newCode, setNewCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [splitView, setSplitView] = useState(true)

  const sampleOldCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

const userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput;

var userName = "John";
const MAX_ITEMS = 100;
`

  const sampleNewCode = `function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

const userInput = document.getElementById('input').value;
const sanitizedInput = DOMPurify.sanitize(userInput);
document.getElementById('output').textContent = sanitizedInput;

const userName = "John";
const MAX_ITEMS = 100;
`

  useEffect(() => {
    setOldCode(sampleOldCode)
    setNewCode(sampleNewCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    const suggestions = await analyzeDiff(oldCode, newCode, language)
    setAiSuggestions(suggestions)
    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertCircle size={18} />
      case 'medium': return <Info size={18} />
      case 'low': return <CheckCircle size={18} />
      default: return <Info size={18} />
    }
  }

  return (
    <div className="code-diff-container">
      <div className="page-header">
        <div className="header-content">
          <Code size={32} />
          <div>
            <h1>AI Enhanced Code Diff Viewer</h1>
            <p>Intelligent code comparison with AI-powered suggestions</p>
          </div>
        </div>
      </div>

      <div className="controls-panel">
        <div className="control-group">
          <label>Programming Language</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="control-group">
          <label>View Mode</label>
          <div className="view-toggle">
            <button 
              className={splitView ? 'active' : ''}
              onClick={() => setSplitView(true)}
            >
              Split View
            </button>
            <button 
              className={!splitView ? 'active' : ''}
              onClick={() => setSplitView(false)}
            >
              Unified View
            </button>
          </div>
        </div>

        <button 
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          <Sparkles size={18} />
          {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
        </button>
      </div>

      <div className="editor-section">
        <div className="editor-panel">
          <div className="editor-header">
            <h3>Original Code</h3>
          </div>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="code-editor"
            placeholder="Paste your original code here..."
          />
        </div>

        <div className="editor-panel">
          <div className="editor-header">
            <h3>Modified Code</h3>
          </div>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="code-editor"
            placeholder="Paste your modified code here..."
          />
        </div>
      </div>

      <div className="diff-viewer-section">
        <h2>Code Differences</h2>
        <div className="diff-wrapper">
          <ReactDiffViewer
            oldValue={oldCode}
            newValue={newCode}
            splitView={splitView}
            useDarkTheme={false}
            showDiffOnly={false}
            leftTitle="Original"
            rightTitle="Modified"
          />
        </div>
      </div>

      {aiSuggestions.length > 0 && (
        <div className="ai-suggestions-section">
          <div className="suggestions-header">
            <Sparkles size={24} />
            <h2>AI Analysis & Suggestions</h2>
          </div>
          
          <div className="suggestions-list">
            {aiSuggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-card"
                style={{ borderLeftColor: getSeverityColor(suggestion.severity) }}
              >
                <div className="suggestion-header">
                  <div className="suggestion-meta">
                    <span 
                      className="severity-badge"
                      style={{ 
                        backgroundColor: getSeverityColor(suggestion.severity) + '20',
                        color: getSeverityColor(suggestion.severity)
                      }}
                    >
                      {getSeverityIcon(suggestion.severity)}
                      {suggestion.severity}
                    </span>
                    <span className="suggestion-type">{suggestion.type}</span>
                    <span className="line-number">Line {suggestion.line}</span>
                  </div>
                </div>
                <div className="suggestion-content">
                  <p className="suggestion-message">{suggestion.message}</p>
                  <div className="suggestion-recommendation">
                    <strong>Recommendation:</strong>
                    <p>{suggestion.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .code-diff-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
        }

        .header-content p {
          margin: 0;
          opacity: 0.9;
        }

        .controls-panel {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          align-items: flex-end;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-group label {
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
        }

        .language-select {
          padding: 0.625rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .view-toggle button {
          padding: 0.625rem 1rem;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .view-toggle button.active {
          background: #667eea;
          color: white;
        }

        .analyze-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .analyze-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .analyze-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .editor-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .editor-panel {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .editor-header {
          background: #f9fafb;
          padding: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .editor-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #374151;
        }

        .code-editor {
          width: 100%;
          min-height: 300px;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          border: none;
          resize: vertical;
          line-height: 1.6;
        }

        .diff-viewer-section {
          margin-bottom: 2rem;
        }

        .diff-viewer-section h2 {
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .diff-wrapper {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .ai-suggestions-section {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: #667eea;
        }

        .suggestions-header h2 {
          margin: 0;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .suggestion-card {
          border: 1px solid #e5e7eb;
          border-left-width: 4px;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f9fafb;
        }

        .suggestion-header {
          margin-bottom: 1rem;
        }

        .suggestion-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .severity-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .suggestion-type {
          padding: 0.25rem 0.625rem;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .line-number {
          color: #6b7280;
          font-size: 0.875rem;
          font-family: monospace;
        }

        .suggestion-content {
          color: #374151;
        }

        .suggestion-message {
          margin-bottom: 1rem;
          font-size: 0.9375rem;
        }

        .suggestion-recommendation {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }

        .suggestion-recommendation strong {
          color: #667eea;
          display: block;
          margin-bottom: 0.5rem;
        }

        .suggestion-recommendation p {
          margin: 0;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .editor-section {
            grid-template-columns: 1fr;
          }

          .controls-panel {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}

export default CodeDiffViewerPage
