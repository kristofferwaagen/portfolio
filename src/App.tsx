import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Games from './components/Games'
import Navigation from './components/Navigation'
import './styles/global.scss'

function AppContent() {
  const [currentSection, setCurrentSection] = useState('hero')
  const [isGamesOpen, setIsGamesOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  const handleSectionChange = useCallback((section: string) => {
    setCurrentSection(section)
  }, [])

  const openGames = useCallback(() => {
    setIsGamesOpen(true)
  }, [])

  const closeGames = useCallback(() => {
    setIsGamesOpen(false)
  }, [])

  // Scroll-based section detection (for nav highlight, etc)
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['hero', 'about', 'projects', 'skills', 'contact']
          const scrollPosition = window.scrollY + window.innerHeight / 3

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId)
            if (element) {
              const { offsetTop, offsetHeight } = element
              const sectionStart = offsetTop
              const sectionEnd = offsetTop + offsetHeight
              if (scrollPosition >= sectionStart - 100 && scrollPosition < sectionEnd - 100) {
                if (currentSection !== sectionId) {
                  setCurrentSection(sectionId)
                }
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }
    const detectInitialSection = () => {
      const sections = ['hero', 'about', 'projects', 'skills', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 3
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          const sectionStart = offsetTop
          const sectionEnd = offsetTop + offsetHeight
          if (scrollPosition >= sectionStart - 100 && scrollPosition < sectionEnd - 100) {
            setCurrentSection(sectionId)
            break
          }
        }
      }
    }
    setTimeout(detectInitialSection, 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentSection])

  const memoizedScrollProgress = useMemo(() => (
    <motion.div 
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  ), [scrollYProgress])

  return (
    <div className="app">
      {/* Navigation */}
      <Navigation currentSection={currentSection} setCurrentSection={handleSectionChange} onOpenGames={openGames} />

      {/* Main Content */}
      <main className="main-content">
        <Hero setCurrentSection={handleSectionChange} />
        <About setCurrentSection={handleSectionChange} />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Games Panel */}
      <Games isOpen={isGamesOpen} onClose={closeGames} />

      {/* Scroll Progress Indicator */}
      {memoizedScrollProgress}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
