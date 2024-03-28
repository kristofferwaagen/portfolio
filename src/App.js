import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import InitialLoad from './components/InitialLoad';
import HeroSection from './components/HeroSection'; // Your main content component
import Projects from './components/Projects';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    const finishLoading = () => {
        setIsLoading(false);
    };

    return (
        <div className="App">
            {isLoading ? (
                <InitialLoad onFinishedLoading={finishLoading} />
            ) : (
                <Router>
                    <Routes>
                        <Route path="/" element={<HeroSection />} />
                        <Route path="/projects" element={<Projects />} />
                    </Routes>
                </Router>
            )}
        </div>
    );
};

export default App;
