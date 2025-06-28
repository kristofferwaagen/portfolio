import React from 'react';
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import profilePicture from '/images/profilePicture.png'

interface AboutProps {
  setCurrentSection: (section: string) => void
}

export default function About({ setCurrentSection }: AboutProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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

  const timelineData = [
    {
      year: "Aug 2024 - Present",
      title: "Master's in Software Development",
      description: "Currently taking a master's degree in Software Development at the UiB and HVL.",
      type: "education"
    },
    {
      year: "Jun 2025 - Aug 2025",
      title: "Summer Intern at DeepOcean AS",
      description: "Developed a prototype for ROV planning in Three.js.",
      type: "work"
    },
    {
      year: "Jun 2024 - Present",
      title: "Service Advisor at Elkjøp AS",
      description: "Part-time job as a service advisor at Elkjøp AS, where I help customers with their purchases and provide technical support.",
      type: "work"
    },
    {
      year: "Jun 2024 - Aug 2024",
      title: "Summer Intern at Yatta AS",
      description: "Developed a quiz platform for businesses to create and manage quizzes for their employees using React, Node.js, and MongoDB.",
      type: "work"
    },
    {
      year: "Jun 2023 - Aug 2023",
      title: "Summer Intern at Yatta AS",
      description: "Designed a prototype for LLM-based chatbot for bettering fish health in aquaculture using Microsoft Fabric.",
      type: "work"
    },
    {
      year: "Jun 2022 - Aug 2022",
      title: "Summer Intern at EMP Secure AS",
      description: "Modernized and restructured internal reports systems using Power BI and Grafana.",
      type: "work"
    },
    {
      year: "Jun 2021 - Aug 2021",
      title: "Fullstack Developer Intern at Cegal AS",
      description: "Gained hands-on experience in full-stack development, working with React, Node.js and Spring Boot.",
      type: "work"
    },
    {
      year: "Aug 2020 - Jun 2024",
      title: "Bachelor's Degree",
      description: "Completed bachelor's degree in 'Datateknologi' at the University of Bergen",
      type: "education"
    }
  ]

  const interests = [
    { icon: "🏐", label: "Volleyball", description: "Have played and coached volleyball for 3 years.", color: "#FF6B6B" },
    { icon: "🎮", label: "Gaming", description: "Spend some of my spare time gaming.", color: "#4ECDC4" },
    { icon: "🏋🏻‍♀️", label: "Weight Training", description: "Like to exercise, it's important to stay fit!", color: "#45B7D1" }
  ]

  const handleViewSkills = () => {
    const skillsSection = document.getElementById('skills')
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' })
      setCurrentSection('skills')
    }
  }

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="about-header" variants={itemVariants}>
            <h2 className="section-title">About Me</h2>
            <div className="title-underline" />
          </motion.div>

          <motion.div className="about-who-i-am" variants={itemVariants}>
            <div className="about-text">
              <h3>Who am I?</h3>
              <p>
              Hey! My name is Kristoffer, a 23 year old software development student at HVL and UiB in Bergen, Norway.
              I enjoy building things that work well and scale, especially using cloud tech, system design, and full-stack tools.
              I've picked up experience with Java, Python, and JavaScript through studies and side projects, and I'm always up for learning something new.
              Right now, I'm looking for chances to apply what I've learned in real-world projects, and to work with people who care about building impactful and meaningful software.
              </p>
              <p>
              Feel free to explore my portfolio and don't hesitate reach out!
              </p>
              
              <motion.p
                className="about-cta"
                onClick={handleViewSkills}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Skills →
              </motion.p>
            </div>
            <div className="about-profile">
              <motion.img
                src={profilePicture}
                alt="Kristoffer Einem Wågen"
                className="profile-picture"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
          </motion.div>

          {/* Interests Section */}
          <motion.div className="interests-section" variants={itemVariants}>
            <h3>What do I like?</h3>
            <div className="interests-grid">
              {interests.map((interest, index) => (
                <motion.div
                  key={index}
                  className="interest-card"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                >
                  <div 
                    className="interest-icon"
                    style={{ '--interest-color': interest.color } as React.CSSProperties}
                  >
                    {interest.icon}
                  </div>
                  <h4>{interest.label}</h4>
                  <p>{interest.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="timeline-section" variants={itemVariants}>
            <h3>My Journey</h3>
            <div className="timeline">
              {timelineData.map((item, index) => (
                <motion.div 
                  key={index}
                  className={`timeline-item ${item.type}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="timeline-marker">
                    {/* Removed item.icon as timelineData does not have icon property */}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-year">{item.year}</div>
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-description">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 