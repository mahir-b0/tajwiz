import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import './Stats.css'

const TOPIC_LABELS = {
  noon_sakinah: { label: 'Noon Sakinah', arabic: 'النون الساكنة' },
  qalqalah: { label: 'Qalqalah', arabic: 'القلقلة' },
  waqf: { label: 'Waqf Signs', arabic: 'علامات الوقف' },
}

export default function Stats({ user }) {
  const [profile, setProfile] = useState(null)
  const [topicStats, setTopicStats] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    setLoading(true)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('streak_count, last_played_date')
      .eq('id', user.id)
      .single()
    setProfile(profileData)

    const { data: attempts } = await supabase
      .from('attempts')
      .select('topic, correct')
      .eq('user_id', user.id)

    const stats = {}
    if (attempts) {
      for (const attempt of attempts) {
        if (!stats[attempt.topic]) stats[attempt.topic] = { correct: 0, total: 0 }
        stats[attempt.topic].total += 1
        if (attempt.correct) stats[attempt.topic].correct += 1
      }
    }
    setTopicStats(stats)
    setLoading(false)
  }

  const totalAttempts = Object.values(topicStats).reduce((a, b) => a + b.total, 0)
  const totalCorrect = Object.values(topicStats).reduce((a, b) => a + b.correct, 0)
  const overallPct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null

  const isStreakAlive = () => {
    if (!profile?.last_played_date) return false
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    return profile.last_played_date === today || profile.last_played_date === yesterday
  }

  const streakCount = profile?.streak_count ?? 0
  const streakClass = streakCount === 0 ? 'cold' : isStreakAlive() ? 'hot' : 'cold'

  if (loading) return (
    <main className="stats-page">
      <p className="stats-loading">Loading your stats...</p>
    </main>
  )

  return (
    <main className="stats-page">
      <header className="stats-header">
        <p className="stats-email">{user.email}</p>
        <h1 className="stats-title">Your Progress</h1>
      </header>

      <div className="stats-top">
        <div className="stat-card">
          <span className={`stat-value streak-${streakClass}`}>{streakCount}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{overallPct !== null ? `${overallPct}%` : '—'}</span>
          <span className="stat-label">Overall Accuracy</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalAttempts}</span>
          <span className="stat-label">Questions Answered</span>
        </div>
      </div>

      <section className="stats-section">
        <h2 className="stats-section-title">By Topic</h2>
        <div className="topic-stats">
          {Object.entries(TOPIC_LABELS).map(([id, { label, arabic }]) => {
            const s = topicStats[id]
            const pct = s ? Math.round((s.correct / s.total) * 100) : null
            return (
              <div key={id} className="topic-stat-card">
                <div className="topic-stat-header">
                  <div>
                    <p className="topic-stat-arabic">{arabic}</p>
                    <p className="topic-stat-label">{label}</p>
                  </div>
                  <span className="topic-stat-pct" style={{ color: pct === null ? 'var(--text)' : pct >= 80 ? 'var(--correct)' : pct >= 50 ? 'var(--gold)' : 'var(--wrong)' }}>
                    {pct !== null ? `${pct}%` : '—'}
                  </span>
                </div>
                <div className="topic-stat-bar-bg">
                  <div className="topic-stat-bar" style={{ width: pct !== null ? `${pct}%` : '0%', background: pct === null ? 'var(--gold-border)' : pct >= 80 ? 'var(--correct)' : pct >= 50 ? 'var(--gold)' : 'var(--wrong)' }} />
                </div>
                <p className="topic-stat-count">{s ? `${s.correct} / ${s.total} correct` : 'No attempts yet'}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="stats-actions">
        <Link to="/" className="stats-btn primary">Take a Quiz</Link>
        <button className="stats-btn secondary" onClick={async () => { await supabase.auth.signOut(); navigate('/') }}>Sign Out</button>
      </div>
    </main>
  )
}