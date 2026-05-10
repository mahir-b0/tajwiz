import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './Results.css'

export default function Results({ results }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!results) navigate('/')
  }, [results])

  if (!results) return null

  const { answers, score, total } = results
  const pct = Math.round((score / total) * 100)

  const grade = pct === 100
    ? { label: 'Excellent', msg: 'Allahumma barik! Perfect score!' }
    : pct >= 80
    ? { label: 'Very Good', msg: 'Great work, almost there!' }
    : pct >= 60
    ? { label: 'Good', msg: 'Good effort. Keep revising!' }
    : { label: 'Keep Revising', msg: 'Don\'t give up - repetition is key.' }

  return (
    <main className="results-page">
      <div className="results-card">
        <h1 className="results-grade">{grade.label}</h1>
        <div className="score-circle">
          <span className="score-num">{score}</span>
          <span className="score-sep">/</span>
          <span className="score-total">{total}</span>
        </div>
        <p className="score-pct">{pct}%</p>
        <p className="grade-msg muted">{grade.msg}</p>
      </div>

      

      <section className="review-section">
        <h2 className="review-title">Review</h2>
        <div className="review-list">
          {answers.map((a, i) => (
            <div key={i} className={`review-item ${a.correct ? 'correct' : 'wrong'}`}>
              <div className="review-header">
                <span className="review-indicator">{a.correct ? '✓' : '✗'}</span>
                <span className="review-word">{a.question.word}</span>
                <span className="review-num">Q{i + 1}</span>
              </div>
              <p className="review-question">{a.question.question}</p>
              <div className="review-answers">
                <span>Your answer: <strong>{a.chosen}</strong></span>
                {!a.correct && <span className="correct-answer">Correct: <strong>{a.question.answer}</strong></span>}
              </div>
              <p className="review-explanation">{a.question.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="results-actions">
        <button className="action-btn primary" onClick={() => navigate('/')}>
          New Quiz
        </button>
        <button className="action-btn secondary" onClick={() => window.scrollTo(0,0)}>
          Review Answers ↑
        </button>
      </div>
    </main>
  )
}