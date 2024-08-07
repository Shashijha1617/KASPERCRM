const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { LeaveApplication } = require("../models/leaveModel");
const {
  LeaveApplicationValidation,
  LeaveApplicationHRValidation
} = require("../validations/leavelValidation");

// find  all LeaveApplication Employee
const getAllLeaveApplication = async (req, res) => {
  console.log("byeeee", req.params.id);
  Employee.findById(req.params.id)
    .populate({
      path: "leaveApplication"
    })
    .select("FirstName LastName MiddleName")
    .exec(function (err, employee) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(employee);
      }
    });
};

// find  all LeaveApplication Admin Hr
const getAllLeaveApplicationHr = async (req, res) => {
  const { hr, manager } = req.body;

  // Build the match condition based on whether hr or manager is provided
  let matchCondition = {};
  if (hr) {
    matchCondition = {
      $or: [{ "employeeDetails.reportHr": hr }, { aditionalManager: hr }]
    };
  } else if (manager) {
    matchCondition = {
      $or: [
        { "employeeDetails.reportManager": manager },
        { aditionalManager: manager }
      ]
    };
  }

  try {
    const leaveApplications = await LeaveApplication.aggregate([
      {
        $lookup: {
          from: "employees", // The name of the employee collection
          localField: "employee", // The field in the LeaveApplication collection that references the employee
          foreignField: "_id", // The field in the employee collection to match
          as: "employeeDetails"
        }
      },
      {
        $unwind: "$employeeDetails"
      },
      {
        $match: matchCondition
      },
      {
        $project: {
          FirstName: "$employeeDetails.FirstName",
          LastName: "$employeeDetails.LastName",
          empID: "$employeeDetails.empID",
          Email: "$employeeDetails.Email",
          empObjID: "$employeeDetails._id",
          reportHr: "$employeeDetails.reportHr",
          reportManager: "$employeeDetails.reportManager",
          Leavetype: 1,
          FromDate: 1,
          ToDate: 1,
          Reasonforleave: 1,
          Status: 1,
          aditionalManager: 1,
          createdOn: 1,
          reasonOfRejection: 1,
          updatedBy: 1
        }
      }
    ]);

    res.send(leaveApplications);
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

// create a LeaveApplication
const createLeaveApplication = async (req, res) => {
  console.log("body1111111111111111111", req.body);
  Joi.validate(req.body, (err, result) => {
    if (err) {
      console.log("hiiiiii", err);
      res.status(400).send(err.details[0].message);
    } else {
      Employee.findById(req.params.id, function (err, employee) {
        if (err) {
          console.log(err);
          res.send("err");
        } else {
          let newLeaveApplication;
          newLeaveApplication = {
            Leavetype: req.body.Leavetype,
            FromDate: req.body.FromDate,
            ToDate: req.body.ToDate,
            Reasonforleave: req.body.Reasonforleave,
            Status: req.body.Status,
            employee: req.params.id,
            aditionalManager: req.body.aditionalManager,
            managerEmail: req.body.managerEmail
          };
          console.log(newLeaveApplication);
          console.log("errr1");

          LeaveApplication.create(
            newLeaveApplication,
            function (err, leaveApplication) {
              if (err) {
                console.log("errr1", err);
                res.send("error");
              } else {
                employee.leaveApplication.push(leaveApplication);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                    console.log(data);
                    res.send(leaveApplication);
                  }
                });
                console.log("new leaveApplication Saved");
              }
            }
          );
          console.log(req.body);
        }
      });
    }
  });
};

// find and update the LeaveApplication
const updateLeaveApplication = async (req, res) => {
  Joi.validate(req.body, LeaveApplicationValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newLeaveApplication;

      newLeaveApplication = {
        Leavetype: req.body.Leavetype,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Reasonforleave: req.body.Reasonforleave,
        Status: req.body.Status,
        employee: req.params.id
      };

      LeaveApplication.findByIdAndUpdate(
        req.params.id,
        newLeaveApplication,
        function (err, leaveApplication) {
          if (err) {
            res.send("error");
          } else {
            res.send(newLeaveApplication);
          }
        }
      );
    }
  });
};

// find and update the LeaveApplication adminHr
const updateLeaveApplicationHr = async (req, res) => {
  //   Joi.validate(req.body, LeaveApplicationHRValidation, (err, result) => {
  Joi.validate(req.body, (err, result) => {
    if (err) {
      res.status(400).send(err.details[0].message);
    } else {
      let newLeaveApplication;
      // console.log(req.body);
      newLeaveApplication = {
        Status: req.body.Status,
        updatedBy: req.body.updatedBy,
        reasonOfRejection: req.body.reasonOfRejection
      };
      LeaveApplication.findByIdAndUpdate(
        req.params.id,
        {
          $set: newLeaveApplication
        },
        function (err, numberAffected) {
          // console.log(numberAffected);
          res.send(newLeaveApplication);
        }
      );
    }
  });
};

// // find and delete the LeaveApplication Employee
const deleteLeaveApplication = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
            console.log("LeaveApplication deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(leaveApplication);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
      console.log("delete");
      console.log(req.params.id);
    }
  });
};

// // find and delete the LeaveApplication AdminHr
const deleteLeaveApplicationHr = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
            console.log("LeaveApplication deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(leaveApplication);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
      console.log("delete");
      console.log(req.params.id);
    }
  });
};

module.exports = {
  getAllLeaveApplication,
  getAllLeaveApplicationHr,

  createLeaveApplication,

  updateLeaveApplication,
  updateLeaveApplicationHr,

  deleteLeaveApplication,
  deleteLeaveApplicationHr
};

// const Joi = require("joi");
// const { Employee } = require("../models/employeeModel");
// const { LeaveApplication } = require("../models/leaveModel");
// const {
//   LeaveApplicationValidation,
//   LeaveApplicationHRValidation
// } = require("../validations/leavelValidation");

// // find  all LeaveApplication Employee
// const getAllLeaveApplication = async (req, res) => {
//   console.log("byeeee", req.params.id);
//   Employee.findById(req.params.id)
//     .populate({
//       path: "leaveApplication"
//     })
//     .select("FirstName LastName MiddleName")
//     .exec(function (err, employee) {
//       if (err) {
//         console.log(err);
//         res.send("error");
//       } else {
//         res.send(employee);
//       }
//     });
// };

// // find  all LeaveApplication Admin Hr
// const getAllLeaveApplicationHr = async (req, res) => {
//   LeaveApplication.find()
//     // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
//     .populate({
//       path: "employee"
//     })
//     // .select(" -role -position -department")
//     // .select("FirstName LastName MiddleName"
//     // )
//     .exec(function (err, leaveApplication) {
//       // console.log(filteredCompany);
//       if (err) {
//         console.log(err);
//         res.send("error");
//       } else {
//         res.send(leaveApplication);
//       }
//     });
// };

// // create a LeaveApplication
// const createLeaveApplication = async (req, res) => {
//   console.log("body1111111111111111111", req.body);
//   Joi.validate(req.body, (err, result) => {
//     if (err) {
//       console.log("hiiiiii", err);
//       res.status(400).send(err.details[0].message);
//     } else {
//       Employee.findById(req.params.id, function (err, employee) {
//         if (err) {
//           console.log(err);
//           res.send("err");
//         } else {
//           let newLeaveApplication;
//           newLeaveApplication = {
//             Leavetype: req.body.Leavetype,
//             FromDate: req.body.FromDate,
//             ToDate: req.body.ToDate,
//             Reasonforleave: req.body.Reasonforleave,
//             Status: req.body.Status,
//             employee: req.params.id
//           };
//           console.log(newLeaveApplication);
//           console.log("errr1");

//           LeaveApplication.create(
//             newLeaveApplication,
//             function (err, leaveApplication) {
//               if (err) {
//                 console.log("errr1", err);
//                 res.send("error");
//               } else {
//                 employee.leaveApplication.push(leaveApplication);
//                 employee.save(function (err, data) {
//                   if (err) {
//                     console.log(err);
//                     res.send("err");
//                   } else {
//                     console.log(data);
//                     res.send(leaveApplication);
//                   }
//                 });
//                 console.log("new leaveApplication Saved");
//               }
//             }
//           );
//           console.log(req.body);
//         }
//       });
//     }
//   });
// };

// // find and update the LeaveApplication
// const updateLeaveApplication = async (req, res) => {
//   Joi.validate(req.body, LeaveApplicationValidation, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err.details[0].message);
//     } else {
//       let newLeaveApplication;

//       newLeaveApplication = {
//         Leavetype: req.body.Leavetype,
//         FromDate: req.body.FromDate,
//         ToDate: req.body.ToDate,
//         Reasonforleave: req.body.Reasonforleave,
//         Status: req.body.Status,
//         employee: req.params.id
//       };

//       LeaveApplication.findByIdAndUpdate(
//         req.params.id,
//         newLeaveApplication,
//         function (err, leaveApplication) {
//           if (err) {
//             res.send("error");
//           } else {
//             res.send(newLeaveApplication);
//           }
//         }
//       );
//     }
//   });
// };

// // find and update the LeaveApplication adminHr
// const updateLeaveApplicationHr = async (req, res) => {
//   //   Joi.validate(req.body, LeaveApplicationHRValidation, (err, result) => {
//   Joi.validate(req.body, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err.details[0].message);
//     } else {
//       let newLeaveApplication;
//       console.log(req.body);
//       newLeaveApplication = {
//         Status: req.body.Status,
//         updatedBy: req.body.updatedBy,
//         reasonOfRejection: req.body.reasonOfRejection
//       };
//       LeaveApplication.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: newLeaveApplication
//         },
//         function (err, numberAffected) {
//           console.log(numberAffected);
//           res.send(newLeaveApplication);
//         }
//       );
//     }
//   });
// };

// // // find and delete the LeaveApplication Employee
// const deleteLeaveApplication = async (req, res) => {
//   Employee.findById({ _id: req.params.id }, function (err, employee) {
//     if (err) {
//       res.send("error");
//       console.log(err);
//     } else {
//       LeaveApplication.findByIdAndRemove(
//         { _id: req.params.id2 },
//         function (err, leaveApplication) {
//           if (!err) {
//             console.log("LeaveApplication deleted");
//             Employee.update(
//               { _id: req.params.id },
//               { $pull: { leaveApplication: req.params.id2 } },
//               function (err, numberAffected) {
//                 console.log(numberAffected);
//                 res.send(leaveApplication);
//               }
//             );
//           } else {
//             console.log(err);
//             res.send("error");
//           }
//         }
//       );
//       console.log("delete");
//       console.log(req.params.id);
//     }
//   });
// };

// // // find and delete the LeaveApplication AdminHr
// const deleteLeaveApplicationHr = async (req, res) => {
//   Employee.findById({ _id: req.params.id }, function (err, employee) {
//     if (err) {
//       res.send("error");
//       console.log(err);
//     } else {
//       LeaveApplication.findByIdAndRemove(
//         { _id: req.params.id2 },
//         function (err, leaveApplication) {
//           if (!err) {
//             console.log("LeaveApplication deleted");
//             Employee.update(
//               { _id: req.params.id },
//               { $pull: { leaveApplication: req.params.id2 } },
//               function (err, numberAffected) {
//                 console.log(numberAffected);
//                 res.send(leaveApplication);
//               }
//             );
//           } else {
//             console.log(err);
//             res.send("error");
//           }
//         }
//       );
//       console.log("delete");
//       console.log(req.params.id);
//     }
//   });
// };

// module.exports = {
//   getAllLeaveApplication,
//   getAllLeaveApplicationHr,

//   createLeaveApplication,

//   updateLeaveApplication,
//   updateLeaveApplicationHr,

//   deleteLeaveApplication,
//   deleteLeaveApplicationHr
// };
