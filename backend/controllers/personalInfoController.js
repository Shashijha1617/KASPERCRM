const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const multer = require("multer");
const {
  EmployeePersonalInfoValidation
} = require("../validations/employeeValidation");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");
const {
  cloudinaryFileUploder,
  removeCloudinaryImage
} = require("../cloudinary/cloudinaryFileUpload");
const personalInfo = async (req, res) => {
  Employee.findById(req.params.id)
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "role position department"
      //   // populate: {
      //   //   path: "state",
      //   //   model: "State",
      //   //   populate: {
      //   //     path: "country",
      //   //     model: "Country"
      //   //   }
      //   // }
    })
    .select("-salary -education -familyInfo -workExperience")
    .exec(function (err, employee) {
      // employee = employees;
      res.send(employee);
    });
};

// const updatepersonalInfo = async (req, res) => {
//   Joi.validate(req.body, EmployeePersonalInfoValidation, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err.details[0].message);
//     } else {
//       let newEmployee;

//       newEmployee = {
//         BloodGroup: req.body.BloodGroup,
//         ContactNo: req.body.ContactNo,
//         DOB: req.body.DOB,
//         presonalEmail: req.body.presonalEmail,
//         EmergencyContactNo: req.body.EmergencyContactNo,
//         Gender: req.body.Gender,
//         Hobbies: req.body.Hobbies,
//         PANcardNo: req.body.PANcardNo,
//         PermanetAddress: req.body.PermanetAddress,
//         PresentAddress: req.body.PresentAddress
//       };
//       Employee.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: newEmployee
//         },
//         function (err, numberAffected) {
//           console.log(numberAffected);
//           res.send(newEmployee);
//         }
//       );
//     }

//     console.log("put");
//     console.log(req.body);
//   });
// };
const updatepersonalInfo = async (req, res) => {
  try {
    // Middleware to handle file upload
    fileUploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("Multer error");
      } else if (err) {
        return res.status(500).send("Internal server error");
      }

      // Handle other form fields
      const newEmployee = {
        BloodGroup: req.body.BloodGroup,
        ContactNo: req.body.ContactNo,
        DOB: req.body.DOB,
        presonalEmail: req.body.presonalEmail,
        EmergencyContactNo: req.body.EmergencyContactNo,
        Gender: req.body.Gender,
        Hobbies: req.body.Hobbies,
        PANcardNo: req.body.PANcardNo,
        PermanetAddress: req.body.PermanetAddress,
        PresentAddress: req.body.PresentAddress,
        BankName: req.body.BankName,
        BankAccount: req.body.BankAccount,
        BankIFSC: req.body.BankIFSC
      };

      // Handle file upload to Cloudinary
      if (req.file) {
        const cloudinaryResponse = await cloudinaryFileUploder(req.file.path);
        newEmployee.profile = {
          image_url: cloudinaryResponse.image_url,
          publicId: cloudinaryResponse.publicId
        };
      }

      // Update Employee in MongoDB
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: newEmployee },
        { new: true }
      );

      // Send response
      res.json(updatedEmployee);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  personalInfo,
  updatepersonalInfo
};
