import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import profilePicture from '../assets/profilePicture.png';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import '../HeroSection.css'; // Ensure the CSS file name matches

function HeroSection() {
    const [animationReady, setAnimationReady] = useState(false);

    const navigate = useNavigate();

    // Initialize the fade and scale animation
    const fadeAndScale = useSpring({
        to: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(2)' },
        delay: 500, // Adjust delay as necessary
        onRest: () => setAnimationReady(true), // When animation completes, set animationReady
    });

    const handleClick = () => {
        navigate('/projects');
    };

    return (
        <animated.div style={fadeAndScale} className="profile-container">
            {animationReady && (
                <div className="text-content">
                    <TypeAnimation
                        sequence={[
                            'Hello, my name is Kristoffer',
                            1000,
                            "I'm a computer science student",
                            1000,
                            'Find out more by clicking my picture',
                            1000,
                        ]}
                        wrapper="span"
                        speed={60}
                        style={{ fontSize: '2em', display: 'inline-block' }}
                        repeat={Infinity}
                    />
                </div>
            )}
            <img
                src={profilePicture}
                alt="Profile"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            />
        </animated.div>
    );
}

export default HeroSection;
