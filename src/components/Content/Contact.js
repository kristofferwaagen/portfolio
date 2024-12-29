import React from 'react';

// List of allowed links
const allowedLinks = ['https://www.linkedin.com/in/kristoffer-e-waagen/'];

// Redirect handler with URL validation
function handleRedirect(url) {
    try {
        const parsedUrl = new URL(url);
        if (allowedLinks.includes(parsedUrl.href)) {
            window.open(parsedUrl.href, '_blank', 'noopener,noreferrer'); // Securely open the link
        } else {
            console.error('Blocked unauthorized redirect');
        }
    } catch (error) {
        console.error('Invalid URL provided', error);
    }
}

const Contact = () => (
    <div className="about-container">
        <div className="card-wrapper">
            <h1>Contact Info</h1>
            <div className="card-flex">
                <div
                    className="card"
                    onClick={
                        () => handleRedirect(allowedLinks[0]) // Dynamically reference the link
                    }
                    style={{ cursor: 'pointer' }}
                >
                    <h2>LinkedIn</h2>
                    <p>Feel free to send me a message!</p>
                </div>
            </div>
        </div>
    </div>
);

export default Contact;
