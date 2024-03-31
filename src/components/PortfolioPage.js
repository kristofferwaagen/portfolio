import React from 'react';
import About from './About';
import Projects from './Projects';
import BasicExample from './Navbar';
import '../styles/PortfolioPage.scss';

const PortfolioPage = () => (
    <div className="portfolio-page">
        <BasicExample />
        <section className="section" id="About">
            <About />
        </section>
        <section className="section" id="Projects">
            <Projects />
        </section>
        <section className="section" id="Contact">
            Contact
        </section>
    </div>
);

export default PortfolioPage;
