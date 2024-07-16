



const express = require('express');
const familyRoute = express.Router();

const {verifyHREmployee, verifyEmployee} = require('../middleware/authMiddleware');

const { getAllFamily, createFamily, updateFamily, deleteFamily } = require('../controllers/familyController');

// GET: Retrieve all countries
familyRoute.get("/family-info/:id",   getAllFamily);

// POST: Create a new family
familyRoute.post("/family-info/:id",   createFamily);

// PUT: Update an existing family
familyRoute.put("/family-info/:id",   updateFamily);

// DELETE: Delete a family
familyRoute.delete("family-info/:id",   deleteFamily);

module.exports = familyRoute;