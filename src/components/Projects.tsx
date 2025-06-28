import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

interface Project {
  id: number
  title: string
  description: string
  repoUrl?: string
  company?: string
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'personal' | 'work'>('personal')

  const myProjects: Project[] = [
    {
      id: 1,
      title: 'Portfolio',
      description:
        'Designed and hosted a responsive portfolio website as a static web application in Azure using ReactJS with Sass for styling. Showcased projects and technical skills with a focus on performance and usability.',
      repoUrl: 'https://github.com/kristofferwaagen/portfolio',
    },
    {
      id: 2,
      title: 'Maude Smart Home System',
      description:
        'School project modeling a smart home system using Maude specification language. Implemented object-oriented sensor/actuator components with automation behavior simulation and Linear Temporal Logic (LTL) model checking for formal verification of safety properties.',
      repoUrl: 'https://github.com/DAT355-V25/Maude-smart-home',
    },
    {
      id: 3,
      title: 'Personal Management Hub',
      description:
        'Personal project developing a comprehensive management application using React, Vite, and SCSS. Created a modern, responsive interface for personal organization and task management with clean, maintainable code architecture.',
      repoUrl: 'https://github.com/kristofferwaagen/Personal-Management-Hub',
    },
    {
      id: 4,
      title: 'Poll app',
      description:
        'Developed a single-page application using Vue.js, Node.js, MongoDB, and Docker to enable users to create and interact with polls. Implemented scalable backend solutions and containerized the application for ease of deployment',
      repoUrl:
        'https://github.com/kristofferwaagen/DAT250-Project-Group-1-FeedApp.',
    },
    {
      id: 5,
      title: 'Hotelifinder',
      description:
        "Developed a web application using ReactJS, Next.js, Java, Spring Boot and Tailwind CSS to enable users to get reccommended hotel bookings, based on the user's preferances, planned activities and travel location.",
      repoUrl:
        'https://github.com/DAT251/Hotelifinder',
    },
    {
      id: 6,
      title: 'Fitgen',
      description:
        'Built a Python-based tool leveraging rembg for image background removal and generated random outfit combinations, showcasing automation and creative problem-solving.',
      repoUrl: 'https://github.com/kristofferwaagen/Fitgen',
    },
    {
      id: 7,
      title: 'Haskell music player',
      description:
        'School project where we decided what we wanted to make in Haskell. Made a terminal based MP3 player.',
      repoUrl: 'https://github.com/kristofferwaagen/music-player',
    },
    {
      id: 8,
      title: 'Mario bros spinoff',
      description:
        'School project where in a team we were tasked to make a Mario type game in Java.',
      repoUrl: 'https://github.com/kristofferwaagen/Mario-Bros',
    },
  ]

  const workProjects: Project[] = [
    {
      id: 1,
      title: 'Quiz App',
      company: 'Yatta AS',
      description:
        'Built a quiz platform for organizational training at Yatta using Azure, ReactJS, and MongoDB. Focused on user engagement by implementing responsive design and optimizing backend infrastructure',
    },
    {
      id: 2,
      title: 'Fishhealth analytics',
      company: 'Yatta AS',
      description:
        'Prototyped a solution in Microsoft Fabric using LLMs and machine learning to improve health monitoring in aquaculture. Delivered predictive analytics tools and proof-of-concept models demonstrating operational efficiency.',
    },
    {
      id: 3,
      title: 'Reportsystem redesign',
      company: 'EMP Secure AS',
      description:
        'Reconstructed and modernized internal reporting platforms at EMP Secure using Power BI. Enhanced real-time monitoring through Grafana and PRTG, resulting in improved system reliability and data visualization.',
    },
    {
      id: 4,
      title: 'Web application for Quality Control',
      company: 'Cegal AS',
      description:
        'Developed a web application for process evaluation at Cegal using ReactJS and Spring Boot. Conducted user testing to refine the application and enhance overall user experience.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const currentProjects = activeTab === 'personal' ? myProjects : workProjects

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="projects-container">
        <motion.div
          className="projects-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="projects-header" variants={cardVariants}>
            <h2 className="section-title">My Projects</h2>
            <div className="title-underline" />
            <p className="section-subtitle">
              Here are some of the projects I've worked on. Each one represents 
              a unique challenge and learning experience.
            </p>
          </motion.div>

          <motion.div className="projects-tabs" variants={cardVariants}>
            <motion.button
              className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Personal Projects
            </motion.button>
            <motion.button
              className={`tab-button ${activeTab === 'work' ? 'active' : ''}`}
              onClick={() => setActiveTab('work')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Work Projects
            </motion.button>
          </motion.div>

          <div className="projects-grid">
            {currentProjects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
              >
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    {project.company && (
                      <span className="project-company">{project.company}</span>
                    )}
                  </div>
                  <p className="project-description">{project.description}</p>
                  
                  {project.repoUrl && (
                    <motion.div 
                      className="project-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Repository
                      </motion.a>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 