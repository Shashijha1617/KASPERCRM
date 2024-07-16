

const express = require('express');
const positionRoute = express.Router();

// const cityController = require('../controllers/cityController');
const { verifyAdminHR} = require('../middleware/authMiddleware');


const { getAllEmployerPosition, createEmployerPosition, updateEmployerPosition, deleteEmployerPosition } = require('../controllers/positionController');

// GET: Retrieve all countries
// verifyHR
positionRoute.get("/position",  getAllEmployerPosition);

// POST: Create a new city
positionRoute.post("/position",   createEmployerPosition);

// PUT: Update an existing city
positionRoute.put("/position/:id",   updateEmployerPosition);

// DELETE: Delete a city
positionRoute.delete("/position/:id",   deleteEmployerPosition);

module.exports = positionRoute;