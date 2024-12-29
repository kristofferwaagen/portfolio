import React from 'react';
import About from '../Content/About';
import Projects from '../Content/Projects';
import NavigationBar from '../Navbar';
import Intro from '../Animation/Intro';
import Contact from '../Content/Contact';
import '../../styles/PortfolioPage.scss';

const PortfolioPage = () => {
    return (
        <div className="portfolio-page">
            <NavigationBar />
            <section className="section" id="Home">
                <Intro />
            </section>
            <section className="section" id="About">
                <About />
            </section>
            <section className="section" id="Projects">
                <Projects />
            </section>
            <section className="section" id="Contact">
                <Contact />
            </section>
        </div>
    );
};

export default PortfolioPage;
