

const express = require('express');
const departmentRoute = express.Router();

// const cityController = require('../controllers/cityController');
const {verifyHR, verifyAdminHR} = require('../middleware/authMiddleware');

const { getAllDepartment, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');

// GET: Retrieve all countries
// verifyHR
departmentRoute.get("/department",   getAllDepartment);

// POST: Create a new city
departmentRoute.post("/department",   createDepartment);

// PUT: Update an existing city
departmentRoute.put("/department/:id",   updateDepartment);

// DELETE: Delete a city
departmentRoute.delete("/department/:id",   deleteDepartment);

module.exports = departmentRoute;