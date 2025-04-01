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

const aboutVariants = {
    initial: {
        y: 50,
        opacity: 0,
    },
    animate: {
        y: 0,
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
                Master student in Software Development
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
        <div className="about-wrapper">
            <motion.div
                variants={aboutVariants}
                initial="initial"
                animate="animate"
            >
                My name is Kristoffer, a Software Development student at HVL and UiB
                in Bergen, Norway. I am passionate about software development,
                cloud computing and system design. Through my studies and spare
                time, I have built up experience with Java, Python, JavaScript,
                and full-stack applications. I’m eager to apply my skills in
                real-world challenges and collaborate on impactful projects.
                Feel free to explore my portfolio and reach out!
            </motion.div>
        </div>
    </div>
);

export default Intro;
