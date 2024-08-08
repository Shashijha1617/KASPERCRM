import React, { useState } from "react";
import "./Salary.css";
import axios from "axios";
import SalaryTable from "./SalaryTable.jsx";
import SalaryForm from "./SalaryForm.jsx";
import SalaryFormEdit from "./SalaryFormEdit.jsx";
import BASE_URL from "../config/config.js";

const Salary = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSalarySubmit = (event) => {
    event.preventDefault();
    const {
      BasicSalary,
      HRASalary,
      MAllowance,
      SpecialAllowance,
      otherAllowance,
      LeaveDeduct,
      PFDeduct,
      BankName,
      AccountNo,
      AccountHolderName,
      IFSCcode,
      TaxDeduction,
      totalSalary,
      ReAccountNo,
    } = event.target.elements;

    if (AccountNo.value !== ReAccountNo.value) {
      window.alert("The bank account number you entered does not match ");
      return;
    }

    const body = {
      BasicSalary: BasicSalary.value,
      HRASalary: HRASalary.value,
      MAllowance: MAllowance.value,
      SpecialAllowance: SpecialAllowance.value,
      otherAllowance: otherAllowance.value,
      LeaveDeduct: LeaveDeduct.value,
      PFDeduct: PFDeduct.value,
      BankName: BankName.value,
      AccountNo: AccountNo.value,
      AccountHolderName: AccountHolderName.value,
      IFSCcode: IFSCcode.value,
      TaxDeduction: TaxDeduction.value,
      totalSalary: totalSalary.value,
    };

    axios
      .post(`${BASE_URL}/api/salary/${event.target.employeeId.value}`, body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then(() => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          window.alert(err.response.data);
        }
      });
  };

  const handleAddSalary = () => {
    setTable(false);
  };

  const handleEditSalary = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleSalaryEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    if (!(newInfo.target[9].value === newInfo.target[10].value)) {
      window.alert("The bank account number you entered does not match ");
    } else {
      let body = {
        BasicSalary: newInfo.target[1].value,
        HRASalary: newInfo.target[2].value, // Ensure HRASalary is included
        MAllowance: newInfo.target[3].value,
        SpecialAllowance: newInfo.target[4].value,
        otherAllowance: newInfo.target[5].value,
        LeaveDeduct: newInfo.target[6].value,
        PFDeduct: newInfo.target[7].value,
        BankName: newInfo.target[8].value,
        AccountNo: newInfo.target[9].value,
        AccountHolderName: newInfo.target[10].value,
        IFSCcode: newInfo.target[11].value,
        TaxDeduction: newInfo.target[12].value,
        totalSalary: newInfo.target[13].value,
      };

      axios
        .put(`${BASE_URL}/api/salary/` + info["salary"][0]["_id"], body, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          setTable(false);
          setTable(true);
        })
        .catch((err) => {
          console.log(err);
        });

      setEditForm(false);
    }
  };

  // Placeholder functions - replace with actual implementations
  const handleEditFormGenderChange = () => {
    // Implement your logic here
  };

  const handleAddFormGenderChange = () => {
    // Implement your logic here
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <SalaryFormEdit
            onSalaryEditUpdate={handleSalaryEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
            onGenderChange={handleEditFormGenderChange}
          />
        ) : (
          <SalaryTable
            onAddSalary={handleAddSalary}
            onEditSalary={handleEditSalary}
          />
        )
      ) : (
        <SalaryForm
          onSalarySubmit={handleSalarySubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default Salary;
