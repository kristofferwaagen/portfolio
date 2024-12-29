import React from 'react';
import { motion } from 'framer-motion';
import profilePicture from '../../assets/profilePicture.png';

// Text animation variants (up-to-down)
const textVariants = {
    initial: {
        y: -50,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
        },
    },
};

// Image animation variants (down-to-up)
const imageVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1, // Match the duration with the text animation
        },
    },
};

const Intro = () => (
    <div className="about-container">
        <div className="introHeader">
            <motion.h1
                variants={textVariants}
                initial="initial"
                animate="animate"
            >
                Student, Web Developer & Team Leader
            </motion.h1>
        </div>
        {/* Image animation */}
        <div className="image-wrapper">
            <motion.img
                src={profilePicture}
                alt="Profile"
                variants={imageVariants}
                initial="initial"
                animate="animate"
            />
        </div>
    </div>
);

export default Intro;
