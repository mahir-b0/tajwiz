import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Quiz.css'

export default function Quiz({ quizData, setResults }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!quizData || quizData.length === 0) {
      navigate('/')
    }
  }, [quizData])

  if (!quizData || quizData.length === 0) return null

  const q = quizData[current]
  const isLast = current === quizData.length - 1

  const choose = (option) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
  }

  const next = () => {
    const newAnswers = [...answers, {
      question: q,
      chosen: selected,
      correct: selected === q.answer,
    }]
    setAnswers(newAnswers)

    if (isLast) {
      const score = newAnswers.filter(a => a.correct).length
      setResults({ answers: newAnswers, score, total: quizData.length })
      navigate('/results')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const progress = ((current) / quizData.length) * 100

  return (
    <main className="quiz-page">
      {/* Progress */}
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="quiz-meta">
        <span className="muted">Question {current + 1} of {quizData.length}</span>
        <span className="quiz-score-track muted">
          {answers.filter(a => a.correct).length} correct
        </span>
      </div>

      {/* Arabic word card */}
      <div className="word-card">
        <div className="word-display">{q.word}</div>
        {q.transliteration && (
          <p className="word-translit">{q.transliteration}</p>
        )}
      </div>

      {/* Question text */}
      <p className="question-text">{q.question}</p>

      {/* Options */}
      <div className="options-grid">
        {q.options.map((option) => {
          let cls = 'option-btn'
          if (revealed) {
            if (option === q.answer) cls += ' correct'
            else if (option === selected) cls += ' wrong'
            else cls += ' dimmed'
          }
          if (selected === option && !revealed) cls += ' chosen'

          return (
            <button
              key={option}
              className={cls}
              onClick={() => choose(option)}
              disabled={revealed}
            >
              <span className="option-indicator" />
              {option}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`explanation ${selected === q.answer ? 'correct-bg' : 'wrong-bg'}`}>
          <span className="explanation-icon">{selected === q.answer ? '✓' : '✗'}</span>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Next */}
      {revealed && (
        <div className="next-wrap">
          <button className="next-btn" onClick={next}>
            {isLast ? 'See Results' : 'Next Question'} →
          </button>
        </div>
      )}
    </main>
  )
}
