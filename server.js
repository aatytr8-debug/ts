const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'App Builder is running!' });
});

// Save app configuration
app.post('/api/save', (req, res) => {
    try {
        const appData = req.body;
        // Here you could save to a database or file system
        console.log('Saving app configuration:', appData);
        res.json({ success: true, message: 'App saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Load app configuration
app.get('/api/load/:id', (req, res) => {
    try {
        const appId = req.params.id;
        // Here you could load from a database or file system
        console.log('Loading app configuration:', appId);
        res.json({ success: true, message: 'App loaded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 App Builder server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to the URL above`);
    console.log(`🔧 Press Ctrl+C to stop the server`);
});

module.exports = app;