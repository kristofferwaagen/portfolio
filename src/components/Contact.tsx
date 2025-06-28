import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import githubIcon from '/images/github.png'
import linkedinIcon from '/images/linkedin.png'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaCompleted, setCaptchaCompleted] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaQuestion] = useState(() => {
    const questions = [
      // Basic math
      { question: 'What is 3 + 5?', answer: '8' },
      { question: 'What is 7 - 2?', answer: '5' },
      { question: 'What is 4 × 3?', answer: '12' },
      { question: 'What is 10 ÷ 2?', answer: '5' },
      { question: 'What is 6 + 9?', answer: '15' },
      { question: 'What is 8 - 3?', answer: '5' },
      { question: 'What is 12 ÷ 4?', answer: '3' },
      { question: 'What is 9 × 6?', answer: '54' },
      { question: 'What is 20 - 13?', answer: '7' },
      { question: 'What is 5 + 11?', answer: '16' },
      { question: 'What is 18 ÷ 3?', answer: '6' },
      { question: 'What is 7 × 8?', answer: '56' },
    ]
    return questions[Math.floor(Math.random() * questions.length)]
  })

  const handleEmailClick = () => {
    // Create mailto link
    const subject = encodeURIComponent('Portfolio Contact')
    const body = encodeURIComponent(`
Hi Kristoffer,

I'd like to get in touch with you regarding your portfolio.

Best regards,
[Your name]
    `)
    
    // Use a base64 encoded email to make it harder to find
    const encodedEmail = 'a3Jpc3RvZmZlcndhZ2VuQGdtYWlsLmNvbQ==' // kristofferwagen@gmail.com
    const email = atob(encodedEmail)
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`
    
    // Open email client
    window.open(mailtoLink, '_blank')
  }

  const handleCaptchaSubmit = () => {
    // CAPTCHA verification
    if (captchaAnswer.toLowerCase() !== captchaQuestion.answer.toLowerCase()) {
      alert('Incorrect answer. Please try again.')
      setCaptchaAnswer('')
      return
    }
    
    // CAPTCHA passed - hide it and show email button
    setShowCaptcha(false)
    setCaptchaCompleted(true)
    setCaptchaAnswer('')
  }

  const handleCheckboxChange = () => {
    setShowCaptcha(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const socialLinks = [
    { 
      name: 'GitHub', 
      url: 'https://github.com/kristofferwaagen', 
      icon: githubIcon,
      alt: 'GitHub'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/kristoffer-e-waagen/', 
      icon: linkedinIcon,
      alt: 'LinkedIn'
    }
  ]

  return (
    <section 
      id="contact" 
      className="contact" 
      ref={ref}
    >
      <div className="contact-container">
        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="contact-header" variants={itemVariants}>
            <h2 className="section-title">Get In Touch</h2>
            <div className="title-underline" />
            <p className="section-subtitle">
              Feel free to reach out if you'd like to connect or discuss opportunities.
            </p>
          </motion.div>

          <div className="contact-grid">
            <motion.div className="contact-info" variants={itemVariants}>
              <h3>Contact Information</h3>
              
              <div className="social-links">
                <h4>Connect</h4>
                <div className="social-grid">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    >
                      <img 
                        src={social.icon} 
                        alt={social.alt}
                        className="social-icon"
                      />
                      <span className="social-name">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div className="contact-email-section" variants={itemVariants}>
              <h3>Send me an email</h3>
              <p>Complete the security check below to open your email client.</p>
              
              {!showCaptcha && !captchaCompleted && (
                <motion.div 
                  className="checkbox-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    I'm not a robot - Start security verification
                  </label>
                </motion.div>
              )}
              
              {showCaptcha && (
                <motion.div 
                  className="captcha-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="captcha">Security Check: {captchaQuestion.question}</label>
                  <motion.input
                    type="text"
                    id="captcha"
                    name="captcha"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCaptchaSubmit()
                      }
                    }}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    placeholder="Enter your answer"
                    autoFocus
                  />
                  <motion.button
                    onClick={handleCaptchaSubmit}
                    className="captcha-button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Verify
                  </motion.button>
                </motion.div>
              )}
              
              {captchaCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <motion.button
                    onClick={handleEmailClick}
                    className="email-button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📧 Send Email
                  </motion.button>
                </motion.div>
              )}
              
              <div className="email-info">
                <p><small>This will open your default email client</small></p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 