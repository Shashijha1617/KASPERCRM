const express = require("express");
const employeeRoute = express.Router();

const {
  verifyAdminHR,
  verifyEmployee,
  verifyAll
} = require("../middleware/authMiddleware");

const {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  findParticularEmployee,
  selectedDeleteNotification,
  deleteNotification,
  notificationStatusUpdate,
  multiSelectedDeleteNotification,
  employeeLoginStatusUpdate,
  employeeLogoutStatusUpdate,
  deleteEmployee,
  getEmployeeByStatus
} = require("../controllers/employeeController");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");

// GET: Retrieve all countries
employeeRoute.get("/employee/", verifyAdminHR, getAllEmployee);
employeeRoute.get("/employee/:id?", verifyAll, getAllEmployee);
employeeRoute.get("/particularEmployee/:id", findParticularEmployee);
employeeRoute.post("/notificationStatusUpdate/:id", notificationStatusUpdate);
employeeRoute.post("/managersList", getEmployeeByStatus);
employeeRoute.post("/notificationDeleteHandler/:id", deleteNotification);
employeeRoute.patch("/employeeLoginStatusUpdate", employeeLoginStatusUpdate);
employeeRoute.patch("/employeeLogoutStatusUpdate", employeeLogoutStatusUpdate);
employeeRoute.post(
  "/multiSelectedNotificationDelete",
  multiSelectedDeleteNotification
);
employeeRoute.post("/selectedNotificationDelete", selectedDeleteNotification);
// POST: Create a new employee
// verifyAdminHR
employeeRoute.post(
  "/employee",
  verifyAdminHR,
  fileUploadMiddleware,
  checkFileSize,
  createEmployee
);

// PUT: Update an existing employee
employeeRoute.put(
  "/employee/:id",
  verifyAdminHR,
  fileUploadMiddleware,
  checkFileSize,
  updateEmployee
);

// DELETE: Delete a employee
// employeeRoute.delete("/employee/:id", verifyAdminHR, deleteEmployee);

module.exports = employeeRoute;
