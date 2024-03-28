import React, { useState } from 'react';
import './App.css';
import InitialLoad from './components/InitialLoad';
import HeroSection from './components/HeroSection'; // Your main content component

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
                <HeroSection />
            )}
        </div>
    );
};

export default App;
