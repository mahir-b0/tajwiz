import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [quizData, setQuizData] = useState(null)
  const [results, setResults] = useState(null)

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  return (
    <BrowserRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home setQuizData={setQuizData} />} />
        <Route path="/quiz" element={<Quiz quizData={quizData} setResults={setResults} />} />
        <Route path="/results" element={<Results results={results} />} />
      </Routes>
    </BrowserRouter>
  )
}