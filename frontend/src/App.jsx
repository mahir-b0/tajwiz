import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [quizData, setQuizData] = useState(null)   // questions from API
  const [results, setResults] = useState(null)      // answers + score

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

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
