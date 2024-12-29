import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-scroll'; // For smooth scrolling
import { motion } from 'framer-motion';
import '../styles/Navbar.scss';

const NavigationBar = () => {
    const [activeLink, setActiveLink] = useState('Home'); // Default active link is Home

    // Function to handle scroll and check for the top of the page
    const handleScroll = () => {
        if (window.scrollY === 0) {
            setActiveLink('Home'); // Set Home as active only when at the top
        }
    };

    // Add and remove scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Navbar expand="lg" className="custom-navbar" as={motion.div}>
            <Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link
                            activeClass="active"
                            to="Home"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={`nav-link ${
                                activeLink === 'Home' ? 'active' : ''
                            }`}
                            onSetActive={() => setActiveLink('Home')}
                        >
                            Home
                        </Link>
                        <Link
                            activeClass="active"
                            to="About"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={`nav-link ${
                                activeLink === 'About' ? 'active' : ''
                            }`}
                            onSetActive={() => setActiveLink('About')}
                        >
                            About
                        </Link>
                        <Link
                            activeClass="active"
                            to="Projects"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={`nav-link ${
                                activeLink === 'Projects' ? 'active' : ''
                            }`}
                            onSetActive={() => setActiveLink('Projects')}
                        >
                            Projects
                        </Link>
                        <Link
                            activeClass="active"
                            to="Contact"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={`nav-link ${
                                activeLink === 'Contact' ? 'active' : ''
                            }`}
                            onSetActive={() => setActiveLink('Contact')}
                        >
                            Contact
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
