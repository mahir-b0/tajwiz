import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TOPICS = [
  { id: 'noon_sakinah', label: 'Noon Sakinah', arabic: 'النون الساكنة', desc: 'Ithaar, Idghaam, Iqlaab, Ikhfaa' },
  { id: 'qalqalah', label: 'Qalqalah', arabic: 'القلقلة', desc: 'Letters, Kubra & Sughra' },
  { id: 'waqf', label: 'Waqf Signs', arabic: 'علامات الوقف', desc: 'Stop, continue & pause signs' }
]

export default function Home({ setQuizData }) {
  const [selected, setSelected] = useState([])
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const startQuiz = async () => {
    if (selected.length === 0) {
      setError('Please select at least one topic.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selected, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to generate quiz')
      setQuizData(data.questions)
      navigate('/quiz')
    } catch (e) {
      setError(e.message || 'Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="home">
      <header className="home-hero">
        <p className="hero-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 className="hero-title">Test Your Tajweed</h1>
      </header>

      <section className="home-section">
        
        <h2 className="section-title">Topics</h2>
        <div className="topics-grid">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              className={`topic-card ${selected.includes(topic.id) ? 'selected' : ''}`}
              onClick={() => toggle(topic.id)}
            >
              <div className="topic-check">{selected.includes(topic.id) ? '✓' : ''}</div>
              <p className="topic-arabic">{topic.arabic}</p>
              <p className="topic-label">{topic.label}</p>
              <p className="topic-desc">{topic.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        
        <h2 className="section-title">Number of Questions</h2>
        <div className="count-control">
          <button className="count-btn" onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
          <span className="count-value">{count}</span>
          <button className="count-btn" onClick={() => setCount(c => Math.min(30, c + 1))}>+</button>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="count-slider"
        />
        <p className="count-label muted">Max 30 questions</p>
      </section>

      {error && <p className="error-msg">{error}</p>}

      <div className="start-wrap">
        <button
          className="start-btn"
          onClick={startQuiz}
          disabled={loading || selected.length === 0}
        >
          {loading ? 'Generating...' : 'Begin Quiz'}
        </button>
        {selected.length > 0 && (
          <p className="start-meta muted">
            {count} question{count !== 1 ? 's' : ''} from {selected.length} topic{selected.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </main>
  )
}