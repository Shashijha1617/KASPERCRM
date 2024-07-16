import React, { useState } from "react";
import axios from "axios";
import WorkExperienceTable from "./WorkExperienceTable.jsx";
import WorkExperienceForm from "./WorkExperienceForm.jsx";
import WorkExperienceFormEdit from "./WorkExperienceFormEdit.jsx";
import "./WorkExperience.css";
import BASE_URL from "../../../Pages/config/config.js";

const WorkExperience = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleWorkExperienceSubmit = (event) => {
    event.preventDefault();
    console.log("id", event.target[0].value, event.target[1].value);
    setTable(true);

    let body = {
      CompanyName: event.target[0].value,
      Designation: event.target[1].value,
      FromDate: event.target[2].value,
      ToDate: event.target[3].value
    };

    axios
      .post(`${BASE_URL}/api/work-experience/` + props.data["_id"], body, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddWorkExperience = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditWorkExperience = (e) => {
    console.log(e);
    console.log("clicked6");
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    console.log("clicked1");
    setTable(true);
  };

  const handleEditFormClose = () => {
    console.log("clicked5");
    setEditForm(false);
  };

  const handleWorkExperienceEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    console.log("zero data", newInfo.target[0].value);
    let body = {
      CompanyName: newInfo.target[0].value,
      Designation: newInfo.target[1].value,
      FromDate: newInfo.target[2].value,
      ToDate: newInfo.target[3].value
    };
    console.log("update", body);
    axios
      .put(`${BASE_URL}/api/work-experience/` + info["_id"], body, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });

    setEditForm(false);
  };
  const handleAddFormGenderChange = () => {};

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <WorkExperienceFormEdit
            onWorkExperienceEditUpdate={handleWorkExperienceEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <WorkExperienceTable
            onAddWorkExperience={handleAddWorkExperience}
            onEditWorkExperience={handleEditWorkExperience}
            data={props.data}
            back={props.back}
          />
        )
      ) : (
        <WorkExperienceForm
          onWorkExperienceSubmit={handleWorkExperienceSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default WorkExperience;
