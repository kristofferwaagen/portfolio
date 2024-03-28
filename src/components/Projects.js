import React from 'react';
import '../Projects.scss';

function Projects() {
    // Example projects data
    const projects = [
        {
            id: 1,
            title: 'Project 1',
            description: 'This is a description of Project 1.',
            imageUrl: '/path/to/image1.jpg', // Placeholder image path
            demoUrl: 'http://example.com/demo1', // Placeholder demo URL
            repoUrl: 'http://github.com/example/project1', // Placeholder repository URL
        },
        {
            id: 2,
            title: 'Project 2',
            description: 'This is a description of Project 2.',
            imageUrl: '/path/to/image2.jpg',
            demoUrl: 'http://example.com/demo2',
            repoUrl: 'http://github.com/example/project2',
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
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{ width: '100px', height: '100px' }}
                    />
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
