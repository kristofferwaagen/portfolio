import React from 'react';
import About from './About';
import Projects from './Projects';
import '../styles/PortfolioPage.scss';

const PortfolioPage = () => (
    <div className="portfolio-page">
        {' '}
        <section className="section">
            <About />
        </section>
        <section className="section">
            <Projects />
        </section>
        <section className="section">Temp1</section>
        <section className="section">Temp2</section>
    </div>
);

export default PortfolioPage;
