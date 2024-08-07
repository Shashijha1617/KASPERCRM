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
    if (!(event.target[3].value === event.target[4].value)) {
      window.alert("The bank account number you entered does not match ");
    } else {
      let body = {
        BasicSalary: event.target[1].value,
        BankName: event.target[2].value,
        AccountNo: event.target[3].value,
        AccountHolderName: event.target[5].value,
        IFSCcode: event.target[6].value,
        TaxDeduction: event.target[7].value,
      };

      axios
        .post(`${BASE_URL}/api/salary/` + event.target[0].value, body, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          setTable(true);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          if (err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
    }
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
    setTable(true);
  };

  const handleSalaryEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    if (!(newInfo.target[3].value === newInfo.target[4].value)) {
      window.alert("The bank account number you entered does not match ");
    } else {
      let body = {
        BasicSalary: newInfo.target[1].value,
        BankName: newInfo.target[2].value,
        AccountNo: newInfo.target[3].value,
        AccountHolderName: newInfo.target[5].value,
        IFSCcode: newInfo.target[6].value,
        TaxDeduction: newInfo.target[7].value,
      };

      axios
        .put(`${BASE_URL}/api/salary/` + info["salary"][0]["_id"], body, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
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
            onFormClose={handleEditFormClose}
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
