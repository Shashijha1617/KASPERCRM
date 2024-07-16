
const express = require('express');
const salaryRoute = express.Router();

const { verifyAdminHR} = require('../middleware/authMiddleware');
const { deleteSalary, updateSalary, createSalary, getAllSalary } = require('../controllers/salaryController');

// GET: Retrieve all countries
salaryRoute.get("/salary",  getAllSalary);

// POST: Create a new city
salaryRoute.post("/salary/:id",   createSalary);

// PUT: Update an existing salary
salaryRoute.put("/salary/:id",   updateSalary);

// DELETE: Delete a salary
salaryRoute.delete("/salary/:id/",   deleteSalary);

module.exports = salaryRoute;