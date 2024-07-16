const { ref } = require("joi/lib/types/func");
const { type } = require("joi/lib/types/object");
const mongoose = require("mongoose");

var totalLeaveSchema = new mongoose.Schema({
    sickLeave: { type: Number, required: true },
    totalSickLeave: { type: Number, required: true },
    paidLeave: { type: Number, required: true },
    totalPaidLeave:  { type: Number, required: true },
    totalCasualLeave: { type: Number, required: true },
    totalPaternityLeave: { type: Number, required: true },
    totalMaternityLeave: { type: Number, required: true },
    casualLeave: { type: Number, required: true },
    paternityLeave: { type: Number, required: true },
    maternityLeave: { type: Number, required: true },
    email:  { type: String, required: true },
    FirstName:  { type: String, },
    LastName:  { type: String,  },
    empID:  { type: String, }, 
    profile:  { type: {}, },
    Account: { type: Number },
  });

  var TotalLeave = mongoose.model(
    "TotalLeave",
    totalLeaveSchema
  );
  
  module.exports = {
    TotalLeave
  };