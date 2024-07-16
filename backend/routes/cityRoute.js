const express = require("express");
const cityRoute = express.Router();

// const cityController = require('../controllers/cityController');
const { verifyAdminHR } = require("../middleware/authMiddleware");
const {
  getAllcity,
  createCity,
  updateCity,
  deleteCity
} = require("../controllers/cityController");

// GET: Retrieve all countries
// verifyAdminHR
cityRoute.get("/city",  getAllcity);

// POST: Create a new city
cityRoute.post("/city",  createCity);

// PUT: Update an existing city
cityRoute.put("/city/:id",  updateCity);

// DELETE: Delete a city
cityRoute.delete("/city/:id",  deleteCity);

module.exports = cityRoute;
