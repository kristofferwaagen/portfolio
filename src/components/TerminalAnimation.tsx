import { useEffect, useState, useRef } from 'react';

interface TerminalAnimationProps {
  onComplete?: () => void;
}

const message = `const Portfolio = {
  name: "Kristoffer Einem Wågen",
  age: 23,
  role: "Student",
  location: "Bergen, Norway",
  education: "Master's in Software Development",
  interests: ["Web Technologies", "Cloud Architecture", "System Design"],
  languages: ["Java", "Python", "JavaScript"],
  frameworks: ["React", "Node.js", "Spring Boot"]
};

console.log(Portfolio);`;

export default function TerminalAnimation({ onComplete }: TerminalAnimationProps) {
  const [displayed, setDisplayed] = useState('');
  const hasCompleted = useRef(false);
  
  useEffect(() => {
    if (hasCompleted.current) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(message.slice(0, i + 1));
      i++;
      if (i === message.length) {
        clearInterval(interval);
        hasCompleted.current = true;
        if (onComplete) {
          onComplete();
        }
      }
    }, 18);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <div className="terminal-header">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="terminal-title">node</span>
        </div>
        <pre className="terminal-body">
          {displayed}
          <span className="terminal-cursor">&#9608;</span>
        </pre>
      </div>
    </div>
  );
} 