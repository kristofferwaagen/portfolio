import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import TerminalAnimation from './TerminalAnimation'

interface HeroProps {
  setCurrentSection: (section: string) => void
}

export default function Hero({ setCurrentSection }: HeroProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [showHelpText, setShowHelpText] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  }

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const handleTerminalComplete = () => {
    // Terminal animation completed
  }

  const handleHelpClick = () => {
    setShowHelpText(true)
  }

  const handleScrollToNext = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
      setCurrentSection('about')
    }
  }

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className="hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="hero-terminal" variants={itemVariants}>
            <TerminalAnimation onComplete={handleTerminalComplete} />
            <div className="terminal-outro">
              {!showHelpText ? (
                <button onClick={handleHelpClick} className="help-btn">
                  <span className="help-icon">↑</span>
                  <span className="help-text">Help! Why am I seeing this?</span>
                </button>
              ) : (
                <div className="help-content">
                  <div className="help-text-content">
                    <h4>Don't worry!</h4>
                    <p>This is just a fun way to introduce myself Scroll down to explore more about me, my projects and skills!</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="scroll-indicator"
          variants={scrollIndicatorVariants}
          initial="hidden"
          animate="visible"
          onClick={handleScrollToNext}
          style={{ cursor: 'pointer' }}
        >
          <div className="scroll-arrow" />
          <span>Scroll to explore</span>
          <span>P.S. Scroll down to Contact for a surprise! (after reading the website's content of course)</span>
        </motion.div>
      </div>
    </section>
  )
} 