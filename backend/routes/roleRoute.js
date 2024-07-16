


const express = require('express');
const roleRoute = express.Router();

// const cityController = require('../controllers/cityController');
const { verifyAdminHR } = require('../middleware/authMiddleware');

const { getAllRole, createRole, updateRole, deleteRole } = require('../controllers/roleController');

// GET: Retrieve all countries
// verifyHR
roleRoute.get("/role", getAllRole);

// POST: Create a new city
roleRoute.post("/role",   createRole);

// PUT: Update an existing city
roleRoute.put("/role/:id",   updateRole);

// DELETE: Delete a city
roleRoute.delete("/role/:id",   deleteRole);

module.exports = roleRoute;