import React from 'react';
import profilePicture from '../assets/profilePicture.png';
import '../styles/ProfilePicture.scss';

const Intro = () => (
    <div className="about-container">
        <h1 style={{ paddingTop: '25vh' }}>
            Student, Web Developer & Team Leader
        </h1>
        <img src={profilePicture} alt="Profile" />
    </div>
);

export default Intro;
