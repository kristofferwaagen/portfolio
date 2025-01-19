import React from 'react';
import linkedIn from '../../assets/linkedin.png';
import mail from '../../assets/mail.png';
import github from '../../assets/github.png';

// List of allowed links
const allowedLinks = [
    'https://www.linkedin.com/in/kristoffer-e-waagen/',
    'https://github.com/kristofferwaagen',
];

function handleRedirect(url) {
    // 1) If it’s a mailto link, just open the user’s mail client
    if (url.startsWith('mailto:')) {
        window.location.href = url;
        return;
    }

    // 2) Otherwise, do your existing logic for allowed http/https links
    try {
        const parsedUrl = new URL(url);
        if (allowedLinks.includes(parsedUrl.href)) {
            window.open(parsedUrl.href, '_blank', 'noopener,noreferrer');
        } else {
            console.error('Blocked unauthorized redirect');
        }
    } catch (error) {
        console.error('Invalid URL provided', error);
    }
}

const Contact = () => (
    <div className="contact-container">
        <div className="card-wrapper">
            <h1>Contact Info</h1>
            <div className="card-flex">
                <div
                    className="card"
                    onClick={() => handleRedirect(allowedLinks[0])}
                    style={{ cursor: 'pointer' }}
                >
                    <div>
                        <img
                            src={linkedIn}
                            alt="LinkedIn"
                            style={{
                                width: '36px',
                                height: '36px',
                                paddingTop: '7px',
                            }}
                        />
                    </div>
                    <p>Feel free to send me a message!</p>
                </div>
                <div
                    className="card"
                    onClick={
                        () => handleRedirect(allowedLinks[1]) // Dynamically reference the link
                    }
                    style={{ cursor: 'pointer' }}
                >
                    <div>
                        <img
                            src={github}
                            alt="Github"
                            style={{
                                width: '36px',
                                height: '36px',
                                paddingTop: '5px',
                            }}
                        />
                    </div>
                    <p>Check out my profile!</p>
                </div>
                <div
                    className="card"
                    onClick={
                        () => handleRedirect('mailto:kristofferwagen@gmail.com') // Dynamically reference the link
                    }
                    style={{ cursor: 'pointer' }}
                >
                    <div>
                        <img
                            src={mail}
                            alt="Mail"
                            style={{
                                width: '36px',
                                height: '36px',
                                paddingTop: '5px',
                            }}
                        />
                    </div>
                    <p>Send it my way!</p>
                </div>
            </div>
        </div>
    </div>
);

export default Contact;
