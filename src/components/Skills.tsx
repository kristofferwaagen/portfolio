import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface SkillsProps {
  setCurrentSection: (section: string) => void
}

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  icon?: string
}

export default function Skills({ setCurrentSection }: SkillsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const skills: Skill[] = [
    // Programming Languages
    { name: "Python", level: "Intermediate", category: "Programming Languages" },
    { name: "Java", level: "Intermediate", category: "Programming Languages" },
    { name: "Haskell", level: "Intermediate", category: "Programming Languages" },
    { name: "JavaScript", level: "Beginner", category: "Programming Languages" },
    
    // Frontend Frameworks
    { name: "ReactJS", level: "Intermediate", category: "Frontend Frameworks" },
    { name: "Vue.js", level: "Beginner", category: "Frontend Frameworks" },
    
    // Backend & Runtime
    { name: "Node.js", level: "Intermediate", category: "Backend & Runtime" },
    { name: "Spring Boot", level: "Beginner", category: "Backend & Runtime" },
    
    // Databases
    { name: "MongoDB", level: "Beginner", category: "Databases" },
    { name: "PostgreSQL", level: "Beginner", category: "Databases" },
    { name: "MySQL", level: "Beginner", category: "Databases" },
    
    // Cloud Platforms
    { name: "Microsoft Azure", level: "Beginner", category: "Cloud Platforms" },
    { name: "Microsoft Fabric", level: "Beginner", category: "Cloud Platforms" },
    { name: "Power BI", level: "Beginner", category: "Cloud Platforms" },
    
    // Tools
    { name: "Docker", level: "Beginner", category: "Tools" },
    { name: "Git", level: "Intermediate", category: "Tools" },
    { name: "Figma", level: "Beginner", category: "Tools" }
  ]

  const categories = ["Programming Languages", "Frontend Frameworks", "Backend & Runtime", "Databases", "Cloud Platforms", "Tools"]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#FF6B6B'
      case 'Intermediate': return '#4ECDC4'
      case 'Advanced': return '#45B7D1'
      default: return '#FF6B6B'
    }
  }

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="skills" className="skills" ref={ref}>
      <div className="skills-container">
        <motion.div
          className="skills-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="skills-header" variants={itemVariants}>
            <h2 className="section-title">Skills & Expertise</h2>
            <div className="title-underline" />
            <p className="section-subtitle">
              My technical skills and experience levels across different technologies 
              and frameworks.
            </p>
          </motion.div>

          <div className="skills-categories">
            {categories.map((category) => (
              <motion.div 
                key={category}
                className="skill-category"
                variants={itemVariants}
              >
                <h3 className="category-title">{category}</h3>
                <div className="skills-list">
                  {skills
                    .filter(skill => skill.category === category)
                    .map((skill, index) => (
                      <motion.div 
                        key={skill.name}
                        className="skill-item"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span 
                            className="skill-level-tag"
                            style={{ backgroundColor: getLevelColor(skill.level) }}
                          >
                            {skill.level}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Removed skills-summary and skills-cta sections */}
        </motion.div>
      </div>
    </section>
  )
} 