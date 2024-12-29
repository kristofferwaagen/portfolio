import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/Navbar.scss';

const NavigationBar = () => {
    const handleNavigate = (id) => () => {
        if (id === 'Home') {
            scrollToTop();
        } else {
            scrollToSectionWithOffset(id, 50);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const scrollToSectionWithOffset = (id, dynamicOffset) => {
        const element = document.getElementById(id);
        if (element) {
            const navbar = document.querySelector('.custom-navbar'); // Adjust selector as needed
            const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get the actual height of the navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition +
                window.pageYOffset -
                navbarHeight -
                dynamicOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Navbar expand="lg" className="custom-navbar" as={motion.div}>
            <Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={handleNavigate('Home')}
                            className="nav-link"
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            onClick={handleNavigate('About')}
                            className="nav-link"
                        >
                            About
                        </Nav.Link>
                        <Nav.Link
                            onClick={handleNavigate('Projects')}
                            className="nav-link"
                        >
                            Projects
                        </Nav.Link>
                        <Nav.Link
                            onClick={handleNavigate('Contact')}
                            className="nav-link"
                        >
                            Contact
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
