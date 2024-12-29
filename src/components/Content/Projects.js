import React from 'react';
import '../../styles/PortfolioPage.scss';

function Projects() {
    const projects = [
        {
            id: 1,
            title: 'Portfoilo',
            description: 'Project for this website',
            repoUrl: 'https://github.com/kristofferwaagen/portfolio',
        },
        {
            id: 2,
            title: 'Poll app',
            description:
                'School project where we made a SPA website using full-stack applications',
            repoUrl:
                'https://github.com/kristofferwaagen/DAT250-Project-Group-1-FeedApp.',
        },
        {
            id: 3,
            title: 'Fitgen',
            description:
                "Project that generates a fit for you, based on uploaded clothing pictures, when you're too lazy to make an outfit yourself. Currently a work in progress.",
            repoUrl: 'https://github.com/kristofferwaagen/Fitgen',
        },
        {
            id: 4,
            title: 'Haskell music player',
            description:
                'School project where we decided what we wanted to make in Haskell.',
            repoUrl: 'https://github.com/kristofferwaagen/music-player',
        },
        {
            id: 5,
            title: 'Mario bros spinoff',
            description:
                'School project where in a team we were tasked to make a Mario type game in Java.',
            repoUrl: 'https://github.com/kristofferwaagen/Mario-Bros',
        },
    ];

    return (
        <div className="card-wrapper">
            <h1>My Projects</h1>
            <div className="card-flex">
                {projects.map((project) => (
                    <div key={project.id} className="card">
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Repository
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Projects;
