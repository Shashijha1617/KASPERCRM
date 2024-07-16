import React, { useState } from "react";
import axios from "axios";
import "./Education.css";
import EducationTable from "./EducationTable.jsx";
import EducationForm from "./EducationForm.jsx";
import EducationFormEdit from "./EducationFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";

const Education = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleEducationSubmit = (event) => {
    event.preventDefault();
    setTable(true);

    const body = {
      SchoolUniversity: event.target[0].value,
      Degree: event.target[1].value,
      Grade: event.target[2].value,
      PassingOfYear: event.target[3].value
    };

    axios
      .post(`${BASE_URL}/api/education/${props.data["_id"]}`, body, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then(() => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddEducation = () => {
    setTable(false);
  };

  const handleEditEducation = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleEducationEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    const body = {
      SchoolUniversity: newInfo.target[0].value,
      Degree: newInfo.target[1].value,
      Grade: newInfo.target[2].value,
      PassingOfYear: newInfo.target[3].value
    };

    axios
      .put(`${BASE_URL}/api/education/${info["_id"]}`, body, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then(() => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });

    setEditForm(false);
  };

  return (
    <>
      {table ? (
        editForm ? (
          <EducationFormEdit
            onEducationEditUpdate={handleEducationEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <EducationTable
            onAddEducation={handleAddEducation}
            onEditEducation={handleEditEducation}
            data={props.data}
            back={props.back}
          />
        )
      ) : (
        <EducationForm
          onEducationSubmit={handleEducationSubmit}
          onFormClose={handleFormClose}
          // onGenderChange={handleAddFormGenderChange}
        />
      )}
    </>
  );
};

export default Education;
