import React from 'react';

const Contact = () => (
    <div className="about-container">
        <div className="card-wrapper">
            <h1>Contact Info</h1>
            <div className="card-flex">
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
                    <p>Feel free to send me a message!</p>
                </div>
            </div>
        </div>
    </div>
);

export default Contact;
