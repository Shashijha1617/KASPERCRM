import React, { useState } from "react";
import axios from "axios";
import PersonalInfoTable from "./PersonalInfoTable.jsx";
import PersonalInfoFormEdit from "./PersonalInfoFormEdit.jsx";
import "./PersonalInfo.css";
import BASE_URL from "../../../Pages/config/config.js";

const PersonalInfo = ({ data, back }) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [editFormGender, setEditFormGender] = useState("");
  const id = localStorage.getItem("_id");

  const handleEditPersonalInfo = (e) => {
    console.log(e);
    console.log("clicked6");
    setEditForm(true);
    setEditData(e);
    setEditFormGender(e["Gender"]);
  };

  const handleEditFormClose = () => {
    console.log("clicked5");
    setEditForm(false);
  };

  const handlePersonalInfoEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    console.log("personalinfo data", newInfo.target[0].value);
    const formData = new FormData();
    formData.append("Gender", editFormGender);
    formData.append("ContactNo", newInfo.target[4].value);
    formData.append("EmergencyContactNo", newInfo.target[5].value);
    formData.append("presonalEmail", newInfo.target[6].value);
    formData.append("PANcardNo", newInfo.target[7].value);
    formData.append("DOB", newInfo.target[8].value);
    formData.append("BloodGroup", newInfo.target[9].value);
    formData.append("Hobbies", newInfo.target[10].value);
    formData.append("PresentAddress", newInfo.target[12].value);
    formData.append("PermanetAddress", newInfo.target[13].value);
    formData.append("profile", newInfo.target[11].files[0]);

    console.log("update", formData);
    axios
      .put(`${BASE_URL}/api/personal-info/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
          "Content-Type": "multipart/form-data",
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
  };

  const handleEditFormGenderChange = (e) => {
    setEditFormGender(e.currentTarget.value);
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <PersonalInfoFormEdit
            onPersonalInfoEditUpdate={handlePersonalInfoEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
            onGenderChange={handleEditFormGenderChange}
          />
        ) : (
          <PersonalInfoTable
            onAddPersonalInfo={handleEditPersonalInfo}
            onEditPersonalInfo={handleEditPersonalInfo}
            data={data}
            back={back}
          />
        )
      ) : (
        <div />
      )}
    </React.Fragment>
  );
};

export default PersonalInfo;
