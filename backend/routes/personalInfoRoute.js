const express = require("express");
const personalInfoRoute = express.Router();

const {
  verifyEmployee,
  verifyHREmployee,
  verifyAdminHREmployee
} = require("../middleware/authMiddleware");

const {
  personalInfo,
  updatepersonalInfo
} = require("../controllers/personalInfoController");

// GET: Retrieve all personalInfo
personalInfoRoute.get(
  "/personal-info/:id",
  // verifyAdminHREmployee,
  personalInfo
);

// PUT: Update an existing personalInfo
personalInfoRoute.put(
  "/personal-info/:id",
  // verifyAdminHREmployee,
  updatepersonalInfo
);

module.exports = personalInfoRoute;
