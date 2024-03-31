import React from 'react';
import { motion } from 'framer-motion';
import profilePicture from '../assets/profilePicture.png';
import '../styles/ProfilePicture.scss';

const elementVariants = {
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

const Intro = () => (
    <div className="about-container">
        <motion.h1
            style={{ paddingTop: '18.2vh' }}
            variants={elementVariants}
            initial="initial"
            animate="animate"
        >
            Student, Web Developer & Team Leader
        </motion.h1>
        <img src={profilePicture} alt="Profile" />
    </div>
);

export default Intro;
