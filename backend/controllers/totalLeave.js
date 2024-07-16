const { TotalLeave } = require('../models/totalLeave');
const express = require('express');
const { Employee } = require("../models/employeeModel");

const assignLeave = async (req, res) => {
    try {
        const { employees, sickLeave, paidLeave, casualLeave, paternityLeave, maternityLeave } = req.body;

        const numericSickLeave = parseInt(sickLeave || 0);
        const numericPaidLeave = parseInt(paidLeave  || 0);
        const numericCasualLeave = parseInt(casualLeave  || 0);
        const numericPaternityLeave = parseInt(paternityLeave  || 0);
        const numericMaternityLeave = parseInt(maternityLeave  || 0);

        // Loop through the employees array and update leave quantities for each employee
        for (const employee of employees) {
            const { value } = employee;
const email = value;

            // Ensure the values to be incremented are numeric
            if (!isNaN(numericSickLeave) && !isNaN(numericPaidLeave) && !isNaN(numericCasualLeave) && !isNaN(numericPaternityLeave) && !isNaN(numericMaternityLeave)) {
                // Find the TotalLeave document for the current employee
                let totalLeave = await TotalLeave.findOne({ email });
                const findEmail = await Employee.findOne({ Email: email });
                const {FirstName, LastName, empID, profile,department,Account} = findEmail
                // If TotalLeave document doesn't exist, create a new one
                if (!totalLeave) {
                    totalLeave = new TotalLeave({
                        FirstName, LastName, empID, profile,department,Account, email,
                        sickLeave: numericSickLeave,
                        totalSickLeave: numericSickLeave,
                        paidLeave: numericPaidLeave,
                        totalPaidLeave: numericPaidLeave,
                        casualLeave: numericCasualLeave,
                        totalCasualLeave: numericCasualLeave,
                        paternityLeave: numericPaternityLeave,
                        totalPaternityLeave: numericPaternityLeave,
                        maternityLeave: numericMaternityLeave,
                        totalMaternityLeave: numericMaternityLeave,
                    });
                } else {
                 
                    totalLeave.sickLeave = numericSickLeave;
                    totalLeave.totalSickLeave= numericSickLeave;
                    totalLeave.paidLeave += numericPaidLeave;
                    totalLeave.totalPaidLeave+= numericPaidLeave;
                    totalLeave.casualLeave = numericCasualLeave;
                    totalLeave.totalCasualLeave= numericCasualLeave;
                    totalLeave.paternityLeave = numericPaternityLeave;
                    totalLeave.totalPaternityLeave= numericPaternityLeave;
                    totalLeave.maternityLeave = numericMaternityLeave;
                    totalLeave.totalMaternityLeave= numericMaternityLeave;

                }

            
                await totalLeave.save();
            }
        }

        res.status(200).json({ message: 'Leave assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAvailableLeave = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the TotalLeave document for the given email
        const totalLeave = await TotalLeave.findOne({ email });
        if (!totalLeave) {
            return res.status(404).json({ error: 'Leave data not found' });
        }
        const {sickLeave,totalSickLeave, paidLeave,totalPaidLeave, casualLeave,totalCasualLeave,paternityLeave,totalPaternityLeave, maternityLeave,totalMaternityLeave} = totalLeave;
     
let data = [{sickLeave,totalSickLeave},{paidLeave,totalPaidLeave},{casualLeave,totalCasualLeave},{paternityLeave,totalPaternityLeave},{maternityLeave,totalMaternityLeave}]
       
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getAvailableLeaveByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the TotalLeave document for the given email
        const totalLeave = await TotalLeave.findOne({ email });
        if (!totalLeave) {
            return res.status(404).json({ error: 'Leave data not found' });
        }
        const {sickLeave, paidLeave, casualLeave,paternityLeave, maternityLeave} = totalLeave;
       
let data = [{
    ["Sick Leave"]:sickLeave,["Paid Leave"]:paidLeave,["Casual Leave"]:casualLeave,["Paternity Leave"]:paternityLeave,["Maternity Leave"]:maternityLeave}]
       
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getAllAvailableLeave = async (req, res) => {
    try {
 
        const allLeaveData = await TotalLeave.find({});

        if (allLeaveData.length === 0) {
            return res.status(404).json({ error: 'No leave data found' });
        }

        res.status(200).json(allLeaveData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deductLeave = async (req, res) => {
    try {
        // Destructure the required fields directly from the request body
        const { email, leaveType,totalLeaveRequired } = req.body;
        let totalLeave = await TotalLeave.findOne({ email });
        if (!totalLeave) {
            return res.status(404).json({ error: 'No leave record found for this employee' });
        }
        // Convert the leave counts to numeric values
        if(leaveType==="Sick Leave"){
            const numericSickLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.sickLeave = Math.max(0, totalLeave.sickLeave - numericSickLeave);
            await totalLeave.save();   
        res.status(200).json({ message: 'Leave deducted successfully' });
        }else if(leaveType==="Casual Leave"){
            const numericCasualLeave = parseInt(totalLeaveRequired, 10);
        totalLeave.casualLeave = Math.max(0, totalLeave.casualLeave - numericCasualLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave deducted successfully' });
        }else if(leaveType==="Paid Leave"){
            const numericPaidLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.paidLeave = Math.max(0, totalLeave.paidLeave - numericPaidLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave deducted successfully' });
        }else if(leaveType==="Paternity Leave"){
            const numericPaternityLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.paternityLeave = Math.max(0, totalLeave.paternityLeave - numericPaternityLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave deducted successfully' });
        }else if(leaveType==="Maternity Leave"){
            const numericMaternityLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.maternityLeave = Math.max(0, totalLeave.maternityLeave - numericMaternityLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave deducted successfully' });
        }else{
            res.status(500).json({ message: 'No data found' });  
        }
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const rejectedLeave = async (req, res) => {
    try {
    
        const { email, leaveType,totalLeaveRequired } = req.body;
        let totalLeave = await TotalLeave.findOne({ email });
        if (!totalLeave) {
            return res.status(404).json({ error: 'No leave record found for this employee' });
        }
   
        if(leaveType==="Sick Leave"){
            const numericSickLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.sickLeave = Math.max(0, totalLeave.sickLeave + numericSickLeave);
            await totalLeave.save();   
        res.status(200).json({ message: 'Leave rejected successfully' });
        }else if(leaveType==="Casual Leave"){
            const numericCasualLeave = parseInt(totalLeaveRequired, 10);
        totalLeave.casualLeave = Math.max(0, totalLeave.casualLeave + numericCasualLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave rejected successfully' });
        }else if(leaveType==="Paid Leave"){
            const numericPaidLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.paidLeave = Math.max(0, totalLeave.paidLeave + numericPaidLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave rejected successfully' });
        }else if(leaveType==="Paternity Leave"){
            const numericPaternityLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.paternityLeave = Math.max(0, totalLeave.paternityLeave + numericPaternityLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave rejected successfully' });
        }else if(leaveType==="Maternity Leave"){
            const numericMaternityLeave = parseInt(totalLeaveRequired, 10);
            totalLeave.maternityLeave = Math.max(0, totalLeave.maternityLeave + numericMaternityLeave);
        await totalLeave.save();
        res.status(200).json({ message: 'Leave rejected successfully' });
        }else{
            res.status(500).json({ message: 'No data found' });  
        }
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    assignLeave,getAllAvailableLeave,getAvailableLeave,deductLeave,rejectedLeave,getAvailableLeaveByEmail
};
