import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './Quiz.css'

export default function Quiz({ quizData, setResults, user }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!quizData || quizData.length === 0) navigate('/')
  }, [quizData])

  if (!quizData || quizData.length === 0) return null

  const q = quizData[current]
  const isLast = current === quizData.length - 1

  const choose = (option) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
  }

  const saveAttempt = async (question, correct) => {
    if (!user) return
    await supabase.from('attempts').insert({
      user_id: user.id,
      question_id: question.id,
      topic: question.id.split('_').slice(0, -1).join('_') || question.id.replace(/[0-9]/g, '').replace(/^(ns|ql|wq)/, m => ({ ns: 'noon_sakinah', ql: 'qalqalah', wq: 'waqf' }[m])),
      correct,
    })
  }

  const updateStreak = async () => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_count, last_played_date')
      .eq('id', user.id)
      .single()

    if (!profile) return

    const last = profile.last_played_date
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    let newStreak = profile.streak_count
    if (last === today) return 
    else if (last === yesterday) newStreak += 1
    else newStreak = 1 

    await supabase.from('profiles').update({ streak_count: newStreak, last_played_date: today }).eq('id', user.id)
  }

  const next = async () => {
    const correct = selected === q.answer
    await saveAttempt(q, correct)

    const newAnswers = [...answers, { question: q, chosen: selected, correct }]
    setAnswers(newAnswers)

    if (isLast) {
      await updateStreak()
      const score = newAnswers.filter(a => a.correct).length
      setResults({ answers: newAnswers, score, total: quizData.length })
      navigate('/results')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const progress = (current / quizData.length) * 100

  return (
    <main className="quiz-page">
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="quiz-meta">
        <span className="muted">Question {current + 1} of {quizData.length}</span>
        <span className="quiz-score-track muted">{answers.filter(a => a.correct).length} correct</span>
      </div>

      <div className="word-card">
        <div className="word-display">{q.word}</div>
        {q.transliteration && <p className="word-translit">{q.transliteration}</p>}
      </div>

      <p className="question-text">{q.question}</p>

      <div className="options-grid">
        {q.options.map((option) => {
          let cls = 'option-btn'
          if (revealed) {
            if (option === q.answer) cls += ' correct'
            else if (option === selected) cls += ' wrong'
            else cls += ' dimmed'
          }
          return (
            <button key={option} className={cls} onClick={() => choose(option)} disabled={revealed}>
              <span className="option-indicator" />
              {option}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className={`explanation ${selected === q.answer ? 'correct-bg' : 'wrong-bg'}`}>
          <span className="explanation-icon">{selected === q.answer ? '✓' : '✗'}</span>
          <p>{q.explanation}</p>
        </div>
      )}

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