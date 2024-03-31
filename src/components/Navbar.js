import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../styles/Navbar.scss';

function BasicExample() {
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#Home" className="nav-link">
                            Home
                        </Nav.Link>
                        <Nav.Link href="#About" className="nav-link">
                            About
                        </Nav.Link>
                        <Nav.Link href="#Projects" className="nav-link">
                            Projects
                        </Nav.Link>
                        <Nav.Link href="#Contact" className="nav-link">
                            Contact
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default BasicExample;
