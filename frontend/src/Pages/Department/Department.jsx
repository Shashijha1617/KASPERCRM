import React, { useState, useEffect } from "react";
import "./Department.css";
import axios from "axios";
import DepartmentTable from "./DepartmentTable.jsx";
import DepartmentForm from "./DepartmentForm.jsx";
import DepartmentFormEdit from "./DepartmentFormEdit.jsx";
import BASE_URL from "../config/config.js";

const Department = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleDepartmentSubmit = (event) => {
    event.preventDefault();

    const companyID = event.target[0].value;
    const departmentName = event.target[1].value;

    const body = {
      CompanyID: companyID,
      DepartmentName: departmentName,
    };

    axios
      .post(`${BASE_URL}/api/department`, body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then(() => {
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddDepartment = () => {
    setTable(false);
  };

  const handleEditDepartment = (data) => {
    setEditData(data);
    setEditForm(true);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleDepartmentEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    const body = {
      CompanyID: newInfo.target[0].value,
      DepartmentName: newInfo.target[1].value,
    };

    axios
      .put(`${BASE_URL}/api/department/${info["_id"]}`, body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then(() => {
        setTable(true);
        setEditForm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <DepartmentFormEdit
            onDepartmentEditUpdate={handleDepartmentEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <DepartmentTable
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
          />
        )
      ) : (
        <DepartmentForm
          onDepartmentSubmit={handleDepartmentSubmit}
          onFormClose={handleFormClose}
        />
      )}
    </React.Fragment>
  );
};

export default Department;
