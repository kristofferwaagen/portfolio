import React from 'react';
import '../../styles/PortfolioPage.scss';

function Projects() {
    const myProjects = [
        {
            id: 1,
            title: 'Portfoilo',
            description:
                'Designed and hosted a responsive portfolio website as a static web application in Azure using ReactJS with Sass for styling. Showcased projects and technical skills with a focus on performance and usability.',
            repoUrl: 'https://github.com/kristofferwaagen/portfolio',
        },
        {
            id: 2,
            title: 'Poll app',
            description:
                'Developed a single-page application using Vue.js, Node.js, MongoDB, and Docker to enable users to create and interact with polls. Implemented scalable backend solutions and containerized the application for ease of deployment',
            repoUrl:
                'https://github.com/kristofferwaagen/DAT250-Project-Group-1-FeedApp.',
        },
        {
             id: 3,
            title: 'Hotelifinder',
            description:
                "Developed a web application using ReactJS, Next.js, Java, Spring Boot and Tailwind CSS to enable users to get reccommended hotel bookings, based on the user's preferances, planned activities and travel location.",
            repoUrl:
                'https://github.com/DAT251/Hotelifinder',
        },
        {
            id: 4,
            title: 'Fitgen',
            description:
                'Built a Python-based tool leveraging rembg for image background removal and generated random outfit combinations, showcasing automation and creative problem-solving.',
            repoUrl: 'https://github.com/kristofferwaagen/Fitgen',
        },
        {
            id: 5,
            title: 'Haskell music player',
            description:
                'School project where we decided what we wanted to make in Haskell. Made a terminal based MP3 player.',
            repoUrl: 'https://github.com/kristofferwaagen/music-player',
        },
        {
            id: 6,
            title: 'Mario bros spinoff',
            description:
                'School project where in a team we were tasked to make a Mario type game in Java.',
            repoUrl: 'https://github.com/kristofferwaagen/Mario-Bros',
        },
    ];

    const workProjects = [
        {
            id: 1,
            title: 'Quiz App',
            company: 'Yatta AS',
            description:
                'Built a quiz platform for organizational training at Yatta using Azure, ReactJS, and MongoDB. Focused on user engagement by implementing responsive design and optimizing backend infrastructure',
        },
        {
            id: 2,
            title: 'Fishhealth analytics',
            company: 'Yatta AS',
            description:
                'Prototyped a solution in Microsoft Fabric using LLMs and machine learning to improve health monitoring in aquaculture. Delivered predictive analytics tools and proof-of-concept models demonstrating operational efficiency.',
        },
        {
            id: 3,
            title: 'Reportsystem redesign',
            company: 'EMP Secure AS',
            description:
                'Reconstructed and modernized internal reporting platforms at EMP Secure using Power BI. Enhanced real-time monitoring through Grafana and PRTG, resulting in improved system reliability and data visualization.',
        },
        {
            id: 4,
            title: 'Web application for Quality Control',
            company: 'Cegal AS',
            description:
                'Developed a web application for process evaluation at Cegal using ReactJS and Spring Boot. Conducted user testing to refine the application and enhance overall user experience.',
        },
    ];

    return (
        <div className="card-wrapper">
            <h1>My Projects</h1>
            <div className="card-flex">
                {myProjects.map((project) => (
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
            <h1>Work Projects</h1>
            <div className="card-flex">
                {workProjects.map((project) => (
                    <div key={project.id} className="card">
                        <h2>{project.title}</h2>
                        <h3>{project.company}</h3>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Projects;
