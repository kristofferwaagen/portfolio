import React from 'react';
import profilePicture from '../assets/profilePicture.png';
import '../ProfileHandler.css'; // Ensure the CSS file name matches

function ProfileHandler() {
    const handleClick = () => {
        // Functionality for when the image is clicked
        console.log('Image clicked, load new content here.');
    };

    return (
        <div className="profile-container">
            <div className="text-content">
                <h1>Welcome to My Website!</h1>
                <p>Let's get started with you clicking the image below!</p>
            </div>
            <img src={profilePicture} alt="Profile" onClick={handleClick} />
        </div>
    );
}

export default ProfileHandler;
