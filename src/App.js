import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import HeroSection from './components/HeroSection'; // Your main content component
import PortfolioPage from './components/PortfolioPage';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/pages" element={<PortfolioPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
