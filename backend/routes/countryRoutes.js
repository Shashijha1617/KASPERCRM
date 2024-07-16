const express = require('express');
const contery = express.Router();
// const countryController = require('../controllers/countryController');
const {verifyAdminHR} = require('../middleware/authMiddleware');
const { getAllCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
// GET: Retrieve all countries
// verifyAdminHR
contery.get("/country",  getAllCountries);

// POST: Create a new country
contery.post("/country",  createCountry);

// PUT: Update an existing country
contery.put("/country/:id",  updateCountry);

// DELETE: Delete a country
contery.delete("/country/:id",  deleteCountry);

module.exports = contery;