const express = require('express');
const companyRoute = express.Router();

// const companyController = require('../controllers/companyController');
const {verifyHR, verifyAdminHR} = require('../middleware/authMiddleware');


const { getAllCompanyDetails, createCompany, updateCompanyDtails } = require('../controllers/compnayController');

// verifyHR
// GET: Retrieve all company
companyRoute.get("/company",  getAllCompanyDetails);

// POST: Create a new company
companyRoute.post("/company", createCompany);

// PUT: Update an existing company
companyRoute.put("/company/:id",  updateCompanyDtails);


module.exports = companyRoute;