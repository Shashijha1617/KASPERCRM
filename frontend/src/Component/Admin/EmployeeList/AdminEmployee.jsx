import React, { useState } from "react";
import axios from "axios";
import "../../../Pages/AddEmployee/Employee.css";

import EmployeeTable from "../../../Pages/AddEmployee/EmployeeTable.jsx";
import EmployeeFormEdit from "../../../Pages/AddEmployee/EmployeeFormEdit.jsx";
import EmployeeForm from "../../../Pages/AddEmployee/EmployeeForm.jsx";
import { HashRouter as Router, Route } from "react-router-dom";
import Education from "../../Employee/EmpEducation/Education.jsx";
import FamilyInfo from "../../Employee/EmpFamily/FamilyInfo.jsx";
import WorkExperience from "../../Employee/EmpWorkExp/WorkExperience.jsx";
import PersonalInfo from "../../Employee/EmpPresonal/PersonalInfo.jsx";
import BASE_URL from "../../../Pages/config/config.js";

const AdminEmployee = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [addFormGender, setAddFormGender] = useState("");
  const [editFormGender, setEditFormGender] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [empInfo, setEmpInfo] = useState({});
  const [empInfoBool, setEmpInfoBool] = useState(false);

  const handleEmpInfo = (e) => {
    setEmpInfo(e);
    setEmpInfoBool(true);
  };

  const handleBack = () => {
    setEmpInfoBool(false);
  };

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault();
    // setTable(true);

    const formData = new FormData();

    formData.append("Email", event.target[0].value);
    formData.append("Password", event.target[1].value);
    formData.append("Account", event.target[2].value);
    formData.append("RoleID", event.target[3].value);
    formData.append("Gender", addFormGender);

    formData.append("FirstName", event.target[6].value);
    // formData.append("MiddleName", event.target[7].value);
    formData.append("LastName", event.target[7].value);
    formData.append("DOB", event.target[8].value);
    formData.append("ContactNo", event.target[9].value);

    // formData.append("EmployeeCode", event.target[11].value);
    formData.append("DepartmentID", event.target[10].value);
    formData.append("PositionID", event.target[11].value);
    formData.append("DateOfJoining", event.target[12].value);
    formData.append("profile", event.target[13].files[0]);
    formData.append("reportManager", event.target[14].value);
    formData.append("reportHr", event.target[15].value);
    formData.append("status", "active");
    formData.append("loginStatus", "loggedOut");
    await axios
      .post(`${BASE_URL}/api/employee`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((res) => {
        // setTable(false);
        setTable(true);
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 400) {
          alert(err.response.data);
        }
      });
  };

  const handleAddEmployee = () => {
    setTable(false);
  };

  const handleEditEmployee = (e) => {
    setEditForm(true);
    setEditData(e);
    setEditFormGender(e["Gender"]);
    setEditStatus(e["status"]);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleEmployeeEditUpdate = (info, newInfo) => {
    console.log(editStatus);
    newInfo.preventDefault();

    if (newInfo.target[9].value) {
    }

    const formData = new FormData();

    formData.append("Email", newInfo.target[0].value);
    formData.append("Account", newInfo.target[1].value);
    formData.append("RoleID", newInfo.target[2].value);
    formData.append("Gender", editFormGender);
    formData.append("FirstName", newInfo.target[5].value);
    // formData.append("MiddleName", newInfo.target[6].value);
    formData.append("LastName", newInfo.target[6].value);
    formData.append("DOB", newInfo.target[7].value);
    formData.append("ContactNo", newInfo.target[8].value);
    // formData.append("EmployeeCode", newInfo.target[10].value);
    formData.append("DepartmentID", newInfo.target[9].value);
    formData.append("PositionID", newInfo.target[10].value);
    formData.append("DateOfJoining", newInfo.target[11].value);
    formData.append("profile", newInfo.target[12].files[0]);
    formData.append("reportManager", newInfo.target[13].value);
    formData.append("status", editStatus);
    // formData.append("TerminateDate", newInfo.target[14].value);

    axios
      .put(`${BASE_URL}/api/employee/${info["_id"]}`, formData, {
        headers: {
          authorization: localStorage.getItem("token") || "",
          "Content-Type": "multipart/form-data" // Set content type explicitly for FormData
        }
      })
      .then((res) => {
        setTable(false);
        setTable(true);
        setEditForm(false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert(err.response.data);
        }
      });
  };

  const handleAddFormGenderChange = (e) => {
    setAddFormGender(e.currentTarget.value);
  };

  const handleEditFormGenderChange = (e) => {
    console.log(e.currentTarget.value);
    setEditFormGender(e.currentTarget.value);
  };
  const handleEditFormStatusChange = (e) => {
    setEditStatus(e.currentTarget.value);
  };

  return (
    <Router>
      <Route
        exact
        path="/admin/employee"
        render={(props) => (
          <>
            {table ? (
              editForm ? (
                <EmployeeFormEdit
                  onEmployeeEditUpdate={handleEmployeeEditUpdate}
                  onFormEditClose={handleEditFormClose}
                  editData={editData}
                  onGenderChange={handleEditFormGenderChange}
                  onStatusChange={handleEditFormStatusChange}
                />
              ) : (
                <>
                  {!empInfoBool ? (
                    <EmployeeTable
                      onAddEmployee={handleAddEmployee}
                      onEditEmployee={handleEditEmployee}
                      onEmpInfo={handleEmpInfo}
                    />
                  ) : (
                    <PersonalInfo data={empInfo} onBack={handleBack} />
                  )}
                </>
              )
            ) : (
              <EmployeeForm
                onEmployeeSubmit={handleEmployeeSubmit}
                onFormClose={handleFormClose}
                onGenderChange={handleAddFormGenderChange}
              />
            )}
          </>
        )}
      />

      <Route
        exact
        path="/hr/employee/info/personal-info"
        render={(props) => <PersonalInfo data={empInfo} back={true} />}
      />
      <Route
        exact
        path="/hr/employee/info/education"
        render={(props) => <Education data={empInfo} back={true} />}
      />
      <Route
        exact
        path="/hr/employee/info/family-info"
        render={(props) => <FamilyInfo data={empInfo} back={true} />}
      />
      <Route
        exact
        path="/hr/employee/info/work-experience"
        render={(props) => <WorkExperience data={empInfo} back={true} />}
      />
    </Router>
  );
};

export default AdminEmployee;
