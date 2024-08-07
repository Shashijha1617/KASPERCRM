// const mongoose = require("mongoose");

// // Initialize auto-increment for CityID
// // autoIncrement.initialize(connection);

// var salarySchema = new mongoose.Schema({
//   BasicSalary: { type: String, required: true },
//   BankName: { type: String, required: true },
//   AccountNo: { type: String, required: true },
//   AccountHolderName: { type: String, required: true },
//   IFSCcode: { type: String, required: true },
//   TaxDeduction: { type: String, required: true },
//   HRASalary: { type: String, required: true },
//   PFDeduct: { type: String, required: true },
//   LeaveDeduct: { type: String, required: true },
//   MAllowance: { type: String, required: true },
//   SpecialAllowance: { type: String, required: true },
//   otherAllowance: { type: String, required: true },
//   totalSalary: { type: String, required: true }
// });

// // salarySchema.plugin(autoIncrement.plugin, {
// //   model: "Salary",
// //   field: "SalaryID"
// // });

// var Salary = mongoose.model("Salary", salarySchema);

// module.exports = {
//   Salary
// };

const mongoose = require("mongoose");

// Define the schema with number types
var salarySchema = new mongoose.Schema({
  BasicSalary: { type: Number, required: true },
  BankName: { type: String, required: true },
  AccountNo: { type: String, required: true },
  AccountHolderName: { type: String, required: true },
  IFSCcode: { type: String, required: true },
  TaxDeduction: { type: Number, required: true },
  HRASalary: { type: Number, required: true },
  PFDeduct: { type: Number, required: true },
  LeaveDeduct: { type: Number, required: true },
  MAllowance: { type: Number, required: true },
  SpecialAllowance: { type: Number, required: true },
  otherAllowance: { type: Number, required: true },
  totalSalary: { type: Number, required: true }
});

var Salary = mongoose.model("Salary", salarySchema);

module.exports = {
  Salary
};
