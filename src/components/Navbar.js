import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/Navbar.scss';

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

function NavigationBar() {
    return (
        <Navbar
            expand="lg"
            className="custom-navbar"
            as={motion.div}
            ariants={elementVariants}
            initial="initial"
            animate="animate"
        >
            <Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            as={motion.a}
                            href="#Home"
                            className="nav-link"
                            variants={elementVariants}
                            initial="initial"
                            animate="animate"
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            as={motion.a}
                            href="#About"
                            className="nav-link"
                            variants={elementVariants}
                            initial="initial"
                            animate="animate"
                        >
                            About
                        </Nav.Link>
                        <Nav.Link
                            as={motion.a}
                            href="#Projects"
                            className="nav-link"
                            variants={elementVariants}
                            initial="initial"
                            animate="animate"
                        >
                            Projects
                        </Nav.Link>
                        <Nav.Link
                            as={motion.a}
                            href="#Contact"
                            className="nav-link"
                            variants={elementVariants}
                            initial="initial"
                            animate="animate"
                        >
                            Contact
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
