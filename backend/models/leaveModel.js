const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
// const connection = require('../dbConnection/dbconnect');

// // Initialize auto-increment for CityID
// autoIncrement.initialize(connection);

var leaveApplicationSchema = new mongoose.Schema({
  Leavetype: { type: String, required: true },
  FromDate: { type: Date, required: true },
  ToDate: { type: Date, required: true },
  Reasonforleave: { type: String, required: true },
  Status: { type: String, required: true },
  updatedBy: { type: String },
  createdOn: { type: Date, default: Date.now },
  reasonOfRejection: { type: String },
  aditionalManager: { type: String },
  employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
}, {timestamps:true});

// leaveApplicationSchema.plugin(autoIncrement.plugin, {
//   model: "LeaveApplication",
//   field: "LeaveApplicationID"
// });

var LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationSchema
);

module.exports = {
  LeaveApplication
};

// const { type } = require("joi/lib/types/object");
// const mongoose = require("mongoose");
// // const autoIncrement = require('mongoose-auto-increment');
// // const connection = require('../dbConnection/dbconnect');

// // // Initialize auto-increment for CityID
// // autoIncrement.initialize(connection);

// var leaveApplicationSchema = new mongoose.Schema({
//   Leavetype: { type: String, required: true },
//   FromDate: { type: Date, required: true },
//   ToDate: { type: Date, required: true },
//   Reasonforleave: { type: String, required: true },
//   Status: { type: String, required: true },
//   employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
//   createdOn: { type: Date, default: Date.now }
// });

// // leaveApplicationSchema.plugin(autoIncrement.plugin, {
// //   model: "LeaveApplication",
// //   field: "LeaveApplicationID"
// // });

// var LeaveApplication = mongoose.model(
//   "LeaveApplication",
//   leaveApplicationSchema
// );

// module.exports = {
//   LeaveApplication
// };
