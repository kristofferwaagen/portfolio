import React from 'react';
import '../Projects.scss';

function Projects() {
    // Example projects data
    const projects = [
        {
            id: 1,
            title: 'Haskell music player',
            description:
                'School project where we decided what we wanted to make in Haskell.',
            demoUrl: 'http://example.com/demo1', // Placeholder demo URL
            repoUrl: 'https://github.com/kristofferwaagen/music-player', // Placeholder repository URL
        },
        {
            id: 2,
            title: 'Mario bros spinoff',
            description:
                'School project where in a team we were tasked to make a Mario type game in Java.',
            demoUrl: 'http://example.com/demo2',
            repoUrl: 'https://github.com/kristofferwaagen/Mario-Bros',
        },
        // Add more projects as needed
    ];

    return (
        <div className="projects-container">
            <h1>My Projects</h1>
            {projects.map((project) => (
                <div key={project.id} className="project">
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Live Demo
                    </a>
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
    );
}

export default Projects;
