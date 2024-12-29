const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Apply Helmet middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'sha256-abc123'"], // Replace with actual hashes
                styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles if needed
                imgSrc: ["'self'"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
            },
        },
    })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
