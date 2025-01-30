const express = require('express');
//import express from 'express'
const router = express.Router();
const mutualFundController = require('../controllers/mutualFundController');
//import {getMutualFunds, calculateFutureValue} from '../controllers/mutualFundController.js';

// Get list of mutual funds
router.get('/', mutualFundController.getMutualFunds);

// Calculate future value
router.post('/calculate-fv', mutualFundController.calculateFutureValue);

module.exports = router;
