const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Employee } = require("../models/employeeModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

let jwtKey = process.env.JWTKEY;
const SALT_FECTOUR = 10;

const loginSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string().max(100).required()
});

const loginEmployee = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    // Check if the login request is for an admin
    if (email === "admin@gmail.com" && password === "admin") {
      const admin = {
        _id: "admin-id", // Specific ID for the admin
        Account: 1, // Assuming 1 is the account type for admin
        FirstName: "Admin",
        LastName: "User",
        role: "admin"
      };
      const adminToken = jwt.sign(admin, jwtKey);
      return res.send(adminToken);
    }

    // Check if the login request is for an HR
    if (email === "hr@gmail.com" && password === "hr") {
      const hr = {
        _id: "hr-id", // Specific ID for the HR
        Account: 2, // Assuming 2 is the account type for HR
        FirstName: "HR",
        LastName: "User",
        role: "hr"
      };
      const hrToken = jwt.sign(hr, jwtKey);
      return res.send(hrToken);
    }

    // Find employee by email, contact number, or employee ID
    const employee = await Employee.findOne({
      $or: [{ Email: email }, { ContactNo: email }, { empID: email }]
    });

    if (!employee) {
      return res.status(404).send("Employee not found.");
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, employee.Password);
    if (!passwordMatch) {
      return res.status(400).send("Invalid password.");
    }

    // Prepare data for JWT token
    const data = {
      _id: employee._id,
      Account: employee.Account,
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      reportHr: employee.reportHr || "",
      reportManager: employee.reportManager || "",
      empID: employee.empID,
      profile: employee.profile ? employee.profile.image_url : null,
      status: employee.status,
      loginStatus: employee.loginStatus,
      role: "employee" // Assuming role for regular employees
    };

    // Generate JWT token
    const token = jwt.sign(data, jwtKey);

    // Send token as response
    res.send(token);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  loginEmployee
};

// const Joi = require("joi");
// const jwt = require("jsonwebtoken");
// const { Employee } = require("../models/employeeModel");
// const bcrypt = require("bcrypt");
// require("dotenv").config();

// let jwtKey = process.env.JWTKEY;
// const SALT_FECTOUR = 10;

// const loginEmployee = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Find employee by email
//     console.log("employee ===", email);
//     const employee = await Employee.findOne({
//       $or: [{ Email: email }, { ContactNo: email }, { empID: email }]
//     });
//     // console.log("employee ===========", employee.FirstName);
//     // console.log("employee ===========", employee.reportManager);
//     // console.log("employee ===========", employee.reportManager);
//     console.log("employee ===========1", employee.empID);
//     console.log("employee ===========2", employee.profile);
//     if (!employee) {
//       return res.status(404).send("Employee not found.");
//     } else {
//       // Compare passwords
//       const passwordMatch = await bcrypt.compare(password, employee.Password);
//       if (!passwordMatch) {
//         console.log("pass ==== ----------");
//         return res.status(400).send("Invalid password.");
//       }

//       // Generate JWT token
//       console.log("employeeeeee", employee.profile);
//       if (employee.profile === null) {
//         let data = {
//           _id: employee._id,
//           Account: employee.Account,
//           FirstName: employee.FirstName,
//           LastName: employee.LastName,
//           reportHr: employee.reportHr || "",
//           reportManager: employee.reportManager || "",
//           empID: employee.empID,
//           profile: employee.profile,
//           status: employee.status,
//           loginStatus: employee.loginStatus
//         };
//         const token = jwt.sign(data, jwtKey);

//         // Send token as response

//         res.send(token);
//       } else {
//         const token = jwt.sign(
//           {
//             _id: employee._id,
//             Account: employee.Account,
//             FirstName: employee.FirstName,
//             LastName: employee.LastName,
//             reportHr: employee.reportHr || "",
//             reportManager: employee.reportManager || "",
//             empID: employee.empID,
//             profile: employee.profile.image_url,
//             status: employee.status,
//             loginStatus: employee.loginStatus
//           },
//           jwtKey
//         );

//         // Send token as response
//         res.send(token);
//       }
//     }
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = {
//   loginEmployee
// };
