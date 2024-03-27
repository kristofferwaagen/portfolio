import React from 'react';
import './App.css'; // Main styles for your app
import ProfileHandler from './components/ProfileHandler'; // Import the new component

function App() {
    return (
        <div className="App">
            <ProfileHandler /> {/* Use the new component */}
        </div>
    );
}

export default App;
