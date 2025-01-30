const express = require('express');
//import express from 'express';
const bodyParser = require('body-parser');
//import bodyParser from 'body-parser';
//import cors from 'cors';
const cors = require('cors');
const mutualFundRoutes = require('./routes/mutualFundRoutes');
//import mutualFundRoutes from './routes/mutualFundRoutes.js';

console.log(mutualFundRoutes);


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
//app.use('/', )
app.use('/api/mutual-funds', mutualFundRoutes);

module.exports = app;
