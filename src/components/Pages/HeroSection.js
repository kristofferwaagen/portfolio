import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import profilePicture from '../../assets/profilePicture.png';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../Animation/LoadingAnimation';
import '../../styles/HeroSection.scss';

function HeroSection() {
    const [animationReady, setAnimationReady] = useState(false);
    const [dotVisible, setDotVisible] = useState(false);
    const navigate = useNavigate();

    const fadeAndScale = useSpring({
        to: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(2)' },
        delay: 500,
        onRest: () => setAnimationReady(true),
    });

    const { style, start } = LoadingAnimation(() => navigate('/portfolio'));

    const handleClick = () => {
        setDotVisible(true);
        start();
    };

    return (
        <animated.div style={fadeAndScale} className="profile-container">
            {/* Centered Image */}
            <div className="image-wrapper">
                <img
                    src={profilePicture}
                    id="HeroImage"
                    alt="Profile"
                    onClick={handleClick}
                />
            </div>

            {/* Text below image */}
            {animationReady && (
                <div className="text-content">
                    <TypeAnimation
                        sequence={[
                            'Hello, my name is Kristoffer',
                            1000,
                            'I hold a bachelor’s degree in "Datateknologi"',
                            1000,
                            'I am currently pursuing a master’s degree in Software Development',
                            1000,
                            'Find out more by clicking my image',
                            1000,
                        ]}
                        wrapper="span"
                        speed={60}
                        repeat={Infinity}
                    />
                </div>
            )}

            {/* Dot animation */}
            {dotVisible && (
                <animated.div className="dot" style={style}></animated.div>
            )}
        </animated.div>
    );
}

export default HeroSection;
