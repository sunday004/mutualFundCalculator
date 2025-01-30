//import app  from './app.js';
const app = require('./app')
//import dotenv from 'dotenv'
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
