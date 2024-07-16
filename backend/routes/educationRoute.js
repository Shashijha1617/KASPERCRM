const express = require("express");
const educationRoute = express.Router();

const {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation
} = require("../controllers/educationController");

const {
  verifyHREmployee,
  verifyEmployee
} = require("../middleware/authMiddleware");
// GET: Retrieve all countries

educationRoute.get("/education/:id",  getAllEducation);

// POST: Create a new city
educationRoute.post("/education/:id",  createEducation);

// PUT: Update an existing education
educationRoute.put("/education/:id",  updateEducation);

// DELETE: Delete a education
educationRoute.delete("/education/:id/:id2", deleteEducation);

module.exports = educationRoute;
