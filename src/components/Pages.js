import React from 'react';

function Pages() {
    // Example projects data
    const projects = [
        {
            id: 1,
            title: 'Haskell music player',
            description:
                'School project where we decided what we wanted to make in Haskell.',
            repoUrl: 'https://github.com/kristofferwaagen/music-player', // Placeholder repository URL
        },
        {
            id: 2,
            title: 'Mario bros spinoff',
            description:
                'School project where in a team we were tasked to make a Mario type game in Java.',
            repoUrl: 'https://github.com/kristofferwaagen/Mario-Bros',
        },
        {
            id: 3,
            title: 'Fitgen',
            description:
                "Project that generates a fit for you, based on your clothing, when you're to lazy too make an outfit yourself. Work in progress",
            repoUrl: ' https://github.com/kristofferwaagen/Fitgen',
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

export default Pages;
