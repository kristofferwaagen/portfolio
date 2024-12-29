import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import HeroSection from './components/Pages/HeroSection'; // Main landing page
import PortfolioPage from './components/Pages/PortfolioPage'; // Portfolio with Navbar

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* Route for the landing page */}
                    <Route path="/" element={<HeroSection />} />

                    {/* Route for the portfolio page */}
                    <Route path="/portfolio" element={<PortfolioPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
