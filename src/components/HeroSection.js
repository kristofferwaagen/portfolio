import React from 'react';
import profilePicture from '../assets/profilePicture.png';
import { TypeAnimation } from 'react-type-animation';
import '../HeroSection.css'; // Ensure the CSS file name matches

function HeroSection() {
    const handleClick = () => {
        // Functionality for when the image is clicked
        console.log('Image clicked, load new content here.');
    };

    return (
        <div className="profile-container">
            <div className="text-content">
                <TypeAnimation
                    sequence={[
                        'Hello, my name is Kristoffer',
                        1000,
                        "I'm a computer science student",
                        1000,
                        'Find out more',
                        1000,
                        'By clicking my picture',
                        1000,
                    ]}
                    wrapper="span"
                    speed={60}
                    style={{ fontSize: '2em', display: 'inline-block' }}
                    repeat={Infinity}
                />
            </div>
            <img src={profilePicture} alt="Profile" onClick={handleClick} />
        </div>
    );
}

export default HeroSection;
