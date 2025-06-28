import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    let initialTheme: Theme = 'light'
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      initialTheme = savedTheme
    } else if (prefersDark) {
      initialTheme = 'dark'
    }
    
    // Only set if different from current
    if (initialTheme !== theme) {
      setTheme(initialTheme)
    }
    
    console.log('ThemeContext initialized with:', initialTheme) // Debug log
  }, [])

  useEffect(() => {
    // Update document data attribute and save to localStorage
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    console.log('ThemeContext updated to:', theme) // Debug log
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
} 