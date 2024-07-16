

const express = require('express');
const projectRoute = express.Router();


const { verifyAdmin } = require('../middleware/authMiddleware');
const { getAllProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');

// GET: Retrieve all project
projectRoute.get("/admin/project-bid",   getAllProject);

// POST: Create a new project
projectRoute.post("/admin/project-bid",   createProject);

// PUT: Update an existing project
projectRoute.put("/admin/project-bid/:id",   updateProject);

// DELETE: Delete a project
projectRoute.delete("admin/project-bid/:id/",  deleteProject);

module.exports = projectRoute;