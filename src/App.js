import React from 'react';
import './App.css'; // Main styles for your app
import HeroSection from './components/HeroSection'; // Import the new component

function App() {
    return (
        <div className="App">
            <HeroSection /> {/* Use the new component */}
        </div>
    );
}

export default App;
