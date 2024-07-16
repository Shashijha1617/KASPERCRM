const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Employee } = require("../models/employeeModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

let jwtKey = process.env.JWTKEY;
const SALT_FECTOUR = 10;

const loginEmployee = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find employee by email
    console.log("employee ===", email);
    const employee = await Employee.findOne({
      $or: [{ Email: email }, { ContactNo: email }, { empID: email }]
    });
    // console.log("employee ===========", employee.FirstName);
    console.log("employee ===========", employee.reportManager);
    console.log("employee ===========", employee.reportManager);
    console.log("employee ===========1", employee.empID);
    console.log("employee ===========2", employee.profile);
    if (!employee) {
      return res.status(404).send("Employee not found.");
    } else {
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, employee.Password);
      if (!passwordMatch) {
        console.log("pass ==== ----------");
        return res.status(400).send("Invalid password.");
      }

      // Generate JWT token
      console.log("employeeeeee", employee.profile);
      if (employee.profile === null) {
        let data = {
          _id: employee._id,
          Account: employee.Account,
          FirstName: employee.FirstName,
          LastName: employee.LastName,
          reportHr: employee.reportHr || "",
          reportManager: employee.reportManager || "",
          empID: employee.empID,
          profile: employee.profile,
          status: employee.status,
          loginStatus: employee.loginStatus
        };
        const token = jwt.sign(data, jwtKey);

        // Send token as response

        res.send(token);
      } else {
        const token = jwt.sign(
          {
            _id: employee._id,
            Account: employee.Account,
            FirstName: employee.FirstName,
            LastName: employee.LastName,
            reportHr: employee.reportHr || "",
            reportManager: employee.reportManager || "",
            empID: employee.empID,
            profile: employee.profile.image_url,
            status: employee.status,
            loginStatus: employee.loginStatus
          },
          jwtKey
        );

        // Send token as response
        res.send(token);
      }
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  loginEmployee
};
