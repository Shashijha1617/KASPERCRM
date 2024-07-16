const express = require("express");
const {assignLeave,getAllAvailableLeave,getAvailableLeave,deductLeave,rejectedLeave,getAvailableLeaveByEmail} = require('../controllers/totalLeave');
const totalLeaveRoute = express.Router();

// POST route to assign leave
totalLeaveRoute.post('/assignLeave', assignLeave);
totalLeaveRoute.post('/getLeave', getAvailableLeave);
totalLeaveRoute.get('/getAllLeave', getAllAvailableLeave);
totalLeaveRoute.post('/deductLeave', deductLeave);
totalLeaveRoute.post('/rejectedLeave', rejectedLeave);
totalLeaveRoute.post('/particularLeave', getAvailableLeaveByEmail);


module.exports = { totalLeaveRoute };