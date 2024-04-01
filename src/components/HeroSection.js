import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import profilePicture from '../assets/profilePicture.png';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from './LoadingAnimation';
import '../styles/HeroSection.scss';

function HeroSection() {
    const [animationReady, setAnimationReady] = useState(false);
    const [dotVisible, setDotVisible] = useState(false); // New state to control dot visibility
    const navigate = useNavigate();

    const fadeAndScale = useSpring({
        to: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(2)' },
        delay: 500,
        onRest: () => setAnimationReady(true),
    });

    const { style, start } = LoadingAnimation(() => navigate('/pages#Home'));

    const handleClick = () => {
        setDotVisible(true); // Make the dot visible
        start(); // Then start the animation
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
                        style={{
                            fontSize: '2em',
                            display: 'inline-block',
                        }}
                        repeat={Infinity}
                    />
                </div>
            )}
            {dotVisible && (
                <animated.div className="dot" style={style}></animated.div>
            )}{' '}
            {/* Render dot based on visibility state */}
            <img
                src={profilePicture}
                id="HeroImage"
                alt="Profile"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            />
        </animated.div>
    );
}

export default HeroSection;
