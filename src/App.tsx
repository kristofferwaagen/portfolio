import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import './styles/global.scss'

function AppContent() {
  const [currentSection, setCurrentSection] = useState('hero')
  const { scrollYProgress } = useScroll()

  const handleSectionChange = useCallback((section: string) => {
    setCurrentSection(section)
  }, [])

  // Scroll-based section detection
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['hero', 'about', 'projects', 'skills', 'contact']
          const scrollPosition = window.scrollY + window.innerHeight / 3 // Changed from /2 to /3 for better detection
          let currentSectionFound = false

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId)
            if (element) {
              const { offsetTop, offsetHeight } = element
              const sectionStart = offsetTop
              const sectionEnd = offsetTop + offsetHeight
              
              // More precise section detection with buffer
              if (scrollPosition >= sectionStart - 100 && scrollPosition < sectionEnd - 100) {
                if (currentSection !== sectionId) {
                  setCurrentSection(sectionId)
                }
                currentSectionFound = true
                break
              }
            }
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    // Initial section detection on page load
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

    // Detect initial section on mount
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
      <Navigation currentSection={currentSection} setCurrentSection={handleSectionChange} />

      {/* Main Content */}
      <main className="main-content">
        <Hero setCurrentSection={handleSectionChange} />
        <About setCurrentSection={handleSectionChange} />
        <Projects setCurrentSection={handleSectionChange} />
        <Skills setCurrentSection={handleSectionChange} />
        <Contact setCurrentSection={handleSectionChange} />
      </main>

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
