import React from 'react';
import About from './About';
import Pages from './Pages';
import Navbar from './Navbar';
import Intro from './Intro';
import Contact from './Contact';
import '../styles/PortfolioPage.scss';

const PortfolioPage = () => (
    <div className="portfolio-page">
        <Navbar />
        <section className="section" id="Home">
            <Intro />
        </section>
        <section className="section" id="About">
            <About />
        </section>
        <section className="section" id="Projects">
            <Pages />
        </section>
        <section className="section" id="Contact">
            <Contact />
        </section>
    </div>
);

export default PortfolioPage;
