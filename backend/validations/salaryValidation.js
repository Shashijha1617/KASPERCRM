const Joi = require("joi");

const SalaryValidation = Joi.object({
  BasicSalary: Joi.number().required(),
  BankName: Joi.string().required(),
  AccountNo: Joi.string().required(),
  AccountHolderName: Joi.string().required(),
  IFSCcode: Joi.string().required(),
  TaxDeduction: Joi.number().required(),
  HRASalary: Joi.number().required(), // Ensure HRASalary is included and correctly typed
  PFDeduct: Joi.number().required(),
  LeaveDeduct: Joi.number().required(),
  MAllowance: Joi.number().required(),
  SpecialAllowance: Joi.number().required(),
  otherAllowance: Joi.number().required(),
  totalSalary: Joi.number().required()
});

module.exports = {
  SalaryValidation
};

// const Joi = require("joi");

// const SalaryValidation = Joi.object().keys({
//   BasicSalary: Joi.string().max(20).required(),
//   BankName: Joi.string().max(200).required(),
//   AccountNo: Joi.string().max(200).required(),
//   AccountHolderName: Joi.string().max(200).required(),
//   IFSCcode: Joi.string().max(200).required(),
//   TaxDeduction: Joi.string().max(100).required(),
//   HRASalary: Joi.string().max(20).required(),
//   PFDeduct: Joi.string().max(20).required(),
//   LeaveDeduct: Joi.string().max(20).required(),
//   MAllowance: Joi.string().max(20).required(),
//   SpecialAllowance: Joi.string().max(20).required(),
//   otherAllowance: Joi.string().max(20).required(),
//   totalSalary: Joi.string().max(20).required()
// });

// module.exports = {
//   SalaryValidation
// };
