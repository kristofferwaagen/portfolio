import React from 'react';

const Contact = () => (
    <div className="about-container">
        <div className="card-wrapper">
            <h1>Contact Info</h1>
            <div className="card-flex">
                <div
                    className="card"
                    onClick={() =>
                        (window.location.href =
                            'mailto:kristofferwagen@gmail.com')
                    }
                    style={{ cursor: 'pointer' }}
                >
                    <h2>Contact Me</h2>
                </div>
                <div
                    className="card"
                    onClick={() =>
                        window.open(
                            'https://www.linkedin.com/in/kristoffer-e-waagen/',
                            '_blank'
                        )
                    }
                    style={{ cursor: 'pointer' }}
                >
                    <h2>LinkedIn</h2>
                </div>
            </div>
        </div>
    </div>
);

export default Contact;
