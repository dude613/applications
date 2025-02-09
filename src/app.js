// src/app.js
require('dotenv').config();
const express = require('express');
const submissionsRoutes = require('./features/submissions/submission.routes');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Serve static files from the public folder (for our client-side code)
app.use(express.static('public'));


// API routes for submissions
app.use('/api/submissions', submissionsRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
