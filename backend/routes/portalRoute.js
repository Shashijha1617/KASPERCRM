
const express = require('express');
const portalRoute = express.Router();

const { verifyAdmin} = require('../middleware/authMiddleware');
const { getAllPortal, createPortal, updatePortal, deletePortal } = require('../controllers/portalController');

// GET: Retrieve all countries
portalRoute.get("/admin/portal",  getAllPortal);

// POST: Create a new city
portalRoute.post("/admin/portal",  createPortal);

// PUT: Update an existing education
portalRoute.put("/admin/portal/:id",   updatePortal);

// DELETE: Delete a existing portal
portalRoute.delete("/admin/portal/:id/",   deletePortal);

module.exports = portalRoute;