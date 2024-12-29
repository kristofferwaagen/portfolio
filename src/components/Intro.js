import React from 'react';
import { motion } from 'framer-motion';
import profilePicture from '../assets/profilePicture.png';

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

const imgStyles = {
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.3)',
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
        <img src={profilePicture} alt="Profile" style={imgStyles} />
    </div>
);

export default Intro;
