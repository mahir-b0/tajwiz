import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabase'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Learn from './pages/Learn'
import Auth from './pages/Auth'
import Stats from './pages/Stats'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [quizData, setQuizData] = useState(null)
  const [results, setResults] = useState(null)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }

  if (!authReady) return null

  return (
    <BrowserRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} user={user} />
      <Routes>
        <Route path="/" element={<Home setQuizData={setQuizData} />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/quiz" element={<Quiz quizData={quizData} setResults={setResults} user={user} />} />
        <Route path="/results" element={<Results results={results} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/stats" element={<Stats user={user} />} />
      </Routes>
    </BrowserRouter>
  )
}